package com.hknu.socket;

import java.io.IOException;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hknu.domain.Room;
import com.hknu.domain.WebSocketMessage;
import com.hknu.service.RoomService;

@Component
public class SignalHandler extends TextWebSocketHandler {
	@Autowired
	private RoomService roomService;
	private final ObjectMapper objectMapper = new ObjectMapper();
	private Map<String, Room> sessionIdToRoomMap = new HashMap<>();

	/**
	 * Camera Client Message
	 */
	// SDP Offer message
	private static final String MSG_TYPE_CAMERA_OFFER = "camera_offer";
	// SDP Answer message
	private static final String MSG_TYPE_CAMERA_ANSWER = "camera_answer";
	// New ICE Candidate message
	private static final String MSG_TYPE_CAMERA_ICE = "camera_ice";
	
	/**
	 * Printer Client Message
	 */
	// Print message @junghyeok
	private static final String MSG_TYPE_DEVICE_PRINTER = "print";
//	// SDP Offer message
//	private static final String MSG_TYPE_PRINTER_OFFER = "printer_offer";
//	// SDP Answer message
//	private static final String MSG_TYPE_PRINTER_ANSWER = "printer_answer";
//	// New ICE Candidate message
//	private static final String MSG_TYPE_PRINTER_ICE = "printer_ice";
	
	/**
	 * Device Message
	 */	
	// SDP Offer message
	private static final String MSG_TYPE_DEVICE_CAMERA_OFFER = "device_camera_offer";
	// SDP Answer message
	private static final String MSG_TYPE_DEVICE_CAMERA_ANSWER = "device_camera_answer";
	// New ICE Candidate message
	private static final String MSG_TYPE_DEVICE_CAMERA_ICE = "device_camera_ice";
//	// SDP Offer message
//	private static final String MSG_TYPE_DEVICE_PRINTER_OFFER = "device_printer_offer";
//	// SDP Answer message
//	private static final String MSG_TYPE_DEVICE_PRINTER_ANSWER = "device_printer_answer";
//	// New ICE Candidate message
//	private static final String MSG_TYPE_DEVICE_PRINTER_ICE = "device_printer_ice";
	
	
	/**
	 * Join Message
	 */
	private static final String MSG_TYPE_DEVICE_JOIN = "device_join";
	private static final String MSG_TYPE_CAMERA_JOIN = "camera_join";
	private static final String MSG_TYPE_PRINTER_JOIN = "printer_join";
	
	/**
	 * Leave Message
	 */
	private static final String MSG_TYPE_LEAVE = "leave";

	@Override
	public void afterConnectionClosed(
			final WebSocketSession session, 
			final CloseStatus status) {
		System.out.println(String.format("[ws] Session has been closed with status %s", status));
		sessionIdToRoomMap.remove(session.getId());
	}

	@Override
	public void afterConnectionEstablished(final WebSocketSession session) {
//		sendMessage(session, new WebSocketMessage("Server", MSG_TYPE_DEVICE_JOIN, Boolean.toString(!sessionIdToRoomMap.isEmpty()), null, null));
//		sendMessage(session, new WebSocketMessage("Server", MSG_TYPE_CAMERA_JOIN, Boolean.toString(!sessionIdToRoomMap.isEmpty()), null, null));
//		sendMessage(session, new WebSocketMessage("Server", MSG_TYPE_PRINTER_JOIN, Boolean.toString(!sessionIdToRoomMap.isEmpty()), null, null));
	}

	@Override
	protected void handleTextMessage(
			final WebSocketSession session, 
			final TextMessage textMessage) {
		try {

			// Handle text and image data
			WebSocketMessage message = objectMapper.readValue(textMessage.getPayload(), WebSocketMessage.class);
			System.out.println(String.format("[ws_%s] Message from %s received", message.getType(), message.getFrom()));
			String userName = message.getFrom(); // origin of the message
			String data = message.getData(); // payload

			Room room;
			switch (message.getType()) {
				case MSG_TYPE_CAMERA_OFFER:
				case MSG_TYPE_CAMERA_ANSWER:
				case MSG_TYPE_CAMERA_ICE:
					room = sessionIdToRoomMap.get(session.getId());
					
					if (room != null) {
						Object camera_candidate = message.getCandidate();
						Object camera_sdp = message.getSdp();
						System.out.println(String.format("[ws_camera] Signal: %s",
								camera_candidate != null
								? camera_candidate.toString().substring(0, 64)
								: camera_sdp.toString().substring(0, 64)));

						Map<String, WebSocketSession> deviceCameraClient = roomService.getDeviceClient(room);

						if (!deviceCameraClient.isEmpty()) {
							Map.Entry<String, WebSocketSession> client = deviceCameraClient.entrySet().iterator().next();
							sendMessage(client.getValue(),
									new WebSocketMessage(
											userName,
											message.getType(),
											data,
											camera_candidate,
											camera_sdp));
						}
					}
					break;
					
				case MSG_TYPE_DEVICE_CAMERA_OFFER:
				case MSG_TYPE_DEVICE_CAMERA_ANSWER:
				case MSG_TYPE_DEVICE_CAMERA_ICE:
					room = sessionIdToRoomMap.get(session.getId());
					
					if (room != null) {
						Object device_camera_candidate = message.getCandidate();
						Object device_camera_sdp = message.getSdp();
						System.out.println(String.format("[ws_device_camera] Signal: %s",
								device_camera_candidate != null
										? device_camera_candidate.toString().substring(0, 64)
										: device_camera_sdp.toString().substring(0, 64)));
						
						Map<String, WebSocketSession> cameraClient = roomService.getCameraClient(room);
							
						if (!cameraClient.isEmpty()) {
							Map.Entry<String, WebSocketSession> client = cameraClient.entrySet().iterator().next();
							sendMessage(client.getValue(),
									new WebSocketMessage(
											userName,
											message.getType(),
											data,
											device_camera_candidate,
											device_camera_sdp));
						}
					}
					break;
				
				case MSG_TYPE_DEVICE_PRINTER:
					Room printer_rm = sessionIdToRoomMap.get(session.getId());
					Map<String, WebSocketSession> printer = roomService.getPrinterClient(printer_rm);
					System.out.println(String.format("[ws_device] %s is attempting to print. LENGTH: %d", userName, message.getData().length()));
					if (!printer.isEmpty())
					   	sendMessage(printer.entrySet().iterator().next().getValue(), new WebSocketMessage(session.getId(), MSG_TYPE_DEVICE_PRINTER, message.getData(), null, null));
					else
						System.out.println(String.format("NO PRINTER is in the ROOM with %s", userName));
					break;
					
				case MSG_TYPE_DEVICE_JOIN:
					System.out.println(String.format("[ws_device] %s has joined Room: #%s", userName, message.getData()));
					
					if (roomService.findRoomByStringId(data).orElse(null) == null) {
						System.out.println(String.format("[ws_device] Room created: #%s", userName, message.getData()));
						roomService.addRoom(new Room(Integer.parseInt(message.getData())));
					}
					
					room = roomService.findRoomByStringId(data).orElse(null);
					roomService.addDeviceClient(room, userName, session);
					sessionIdToRoomMap.put(session.getId(), room);
					break;

				case MSG_TYPE_CAMERA_JOIN:
					System.out.println(String.format("[ws_camera] %s has joined Room: #%s", userName, message.getData()));
					room = roomService.findRoomByStringId(data).orElse(null);

					if (room == null) {
						throw new IOException("The device is not ready.");
					}

					roomService.addCameraClient(room, userName, session);
					sessionIdToRoomMap.put(session.getId(), room);

					Map<String, WebSocketSession> deviceClients = roomService.getDeviceClient(room);

					if (!deviceClients.isEmpty()) {
						Map.Entry<String, WebSocketSession> deviceClient = deviceClients.entrySet().iterator().next();
						sendMessage(deviceClient.getValue(),
								new WebSocketMessage(
										userName,
										MSG_TYPE_CAMERA_JOIN,
										"true",
										null,
										null));
					}
					break;

				case MSG_TYPE_PRINTER_JOIN:
					System.out.println(String.format("[ws_printer] %s has joined Room: #%s", userName, message.getData()));
					room = roomService.findRoomByStringId(data).orElse(null);
					
					if (room == null) {
						throw new IOException("The device is not ready.");
					}
					
					roomService.addPrinterClient(room, userName, session);
					sessionIdToRoomMap.put(session.getId(), room);

					deviceClients = roomService.getDeviceClient(room);

					if (!deviceClients.isEmpty()) {
						Map.Entry<String, WebSocketSession> deviceClient = deviceClients.entrySet().iterator().next();
						sendMessage(deviceClient.getValue(),
								new WebSocketMessage(
										userName,
										MSG_TYPE_PRINTER_JOIN,
										"true",
										null,
										null));
					}
					break;

				case MSG_TYPE_LEAVE:
					System.out.println(String.format("[ws_%s] %s is going to leave Room: #%s", message.getType(), userName, message.getData()));
					room = sessionIdToRoomMap.get(session.getId());

					Optional<String> deviceClient = roomService.getDeviceClient(room).entrySet().stream()
							.filter(entry -> Objects.equals(entry.getValue().getId(), session.getId()))
							.map(Map.Entry::getKey)
							.findAny();
					Optional<String> cameraClient = roomService.getCameraClient(room).entrySet().stream()
							.filter(entry -> Objects.equals(entry.getValue().getId(), session.getId()))
							.map(Map.Entry::getKey)
							.findAny();
					Optional<String> printerClient = roomService.getPrinterClient(room).entrySet().stream()
							.filter(entry -> Objects.equals(entry.getValue().getId(), session.getId()))
							.map(Map.Entry::getKey)
							.findAny();
					
					deviceClient.ifPresent(c -> roomService.removeDeviceClientByName(room, c));
					cameraClient.ifPresent(c -> roomService.removeCameraClientByName(room, c));
					printerClient.ifPresent(c -> roomService.removePrinterClientByName(room, c));
					
					sessionIdToRoomMap.remove(session.getId());
					break;

				default:
					System.out.println(String.format("[ws] Type of the received message %s is undefined!", message.getType()));
			}

		} catch (IOException e) {
			System.out.println(String.format("An error occured: %s", e.getMessage()));
		}
	}

	private void sendMessage(
			WebSocketSession session, 
			WebSocketMessage message) {
		try {
			String json = objectMapper.writeValueAsString(message);
			session.sendMessage(new TextMessage(json));
		} catch (IOException e) {
			System.out.println(String.format("An error occured: %s", e.getMessage()));
		}
	}
}