package com.hknu.service;

import java.util.Collections;
import java.util.Comparator;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.WebSocketSession;

import com.hknu.domain.Room;
import com.hknu.util.Parser;

@org.springframework.stereotype.Service
public class RoomService {
	@Autowired
	private Parser parser;
	private final Set<Room> rooms = new TreeSet<>(Comparator.comparing(Room::getId));

	public Set<Room> getRooms() {
		final TreeSet<Room> defensiveCopy = new TreeSet<>(Comparator.comparing(Room::getId));
		defensiveCopy.addAll(rooms);

		return defensiveCopy;
	}

	public Boolean addRoom(final Room room) {
		return rooms.add(room);
	}

	public Optional<Room> findRoomByStringId(final String sid) {
		return rooms.stream().filter(r -> r.getId().equals(parser.parseId(sid).get())).findAny();
	}

	public Integer getRoomId(Room room) {
		return room.getId();
	}

	public Map<String, WebSocketSession> getDeviceClient(final Room room) {
		return Optional.ofNullable(room)
				.map(r -> Collections.unmodifiableMap(r.getDeviceClient()))
				.orElse(Collections.emptyMap());
	}

	public Map<String, WebSocketSession> getCameraClient(final Room room) {
		return Optional.ofNullable(room)
				.map(r -> Collections.unmodifiableMap(r.getCameraClient()))
				.orElse(Collections.emptyMap());
	}
	
	public Map<String, WebSocketSession> getPrinterClient(final Room room) {
		return Optional.ofNullable(room)
				.map(r -> Collections.unmodifiableMap(r.getPrinterClient()))
				.orElse(Collections.emptyMap());
	}
	
	public WebSocketSession addDeviceClient(final Room room, final String name, final WebSocketSession session) {
		return room.getDeviceClient().put(name, session);
	}

	public WebSocketSession addCameraClient(final Room room, final String name, final WebSocketSession session) {
		return room.getCameraClient().put(name, session);
	}
	
	public WebSocketSession addPrinterClient(final Room room, final String name, final WebSocketSession session) {
		return room.getPrinterClient().put(name, session);
	}
	
	public WebSocketSession removeDeviceClientByName(final Room room, final String name) {
		return room.getDeviceClient().remove(name);
	}

	public WebSocketSession removeCameraClientByName(final Room room, final String name) {
		return room.getCameraClient().remove(name);
	}
	
	public WebSocketSession removePrinterClientByName(final Room room, final String name) {
		return room.getPrinterClient().remove(name);
	}
}
