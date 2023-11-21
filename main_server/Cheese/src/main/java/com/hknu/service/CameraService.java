package com.hknu.service;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.hknu.domain.Room;
import com.hknu.dto.response.ResponseDto;
import com.hknu.exception.CustomException;
import com.hknu.util.Parser;

@Service
public class CameraService {
	@Autowired
	private BranchServiceImpl branchServiceImpl;
	@Autowired
	private RoomService roomService;
	@Autowired
	private Parser parser;
	
	public ResponseEntity<ResponseDto<NullType>> enterRoom(
			String branchId, 
			String device) {
		if (parser.parseId(branchId).isPresent()) {
			this.branchServiceImpl.getById(Integer.parseInt(branchId));
			
			Room room = this.roomService.findRoomByStringId(branchId)
					.orElseThrow(() -> new CustomException("[" + branchId + "번 지점] 현재 촬영 서비스가 준비되지 않았습니다."));
			
			if(device != null && !device.isBlank()) {
				if (room.getDeviceClient().entrySet().iterator().next().getKey().equals(device) 
						|| room.getCameraClient().entrySet().iterator().next().getKey().equals(device)) {
					System.out.println(String.format("[%s번 지점] %s 사용자님이 입장하셨습니다.", branchId, device));
					System.out.println(String.format("[%s번 지점] 현재 촬영 상태 [Device : %s, Client : %s]", 
							branchId, 
							room.getDeviceClient().isEmpty() ? null : room.getDeviceClient().entrySet().iterator().next().getKey(), 
							room.getCameraClient().isEmpty() ? null : room.getCameraClient().entrySet().iterator().next().getKey()));
					
					return new ResponseEntity<>(
							ResponseDto.of(String.format("[%s번 지점] %s 사용자님이 촬영 시작합니다.", branchId, device)),
							HttpStatus.OK);
				}
				else {
					return new ResponseEntity<>(
							ResponseDto.of(String.format("[%s번 지점] %s 사용자님 차례가 아닙니다.", branchId, device)),
							HttpStatus.UNAUTHORIZED);
				}
			} else {
				throw new CustomException("Device가 주어지지 않았습니다.");
			}
		}
		throw new CustomException("지점 아이디가 주어지지 않았습니다.");
	}

	public ResponseEntity<ResponseDto<NullType>> exitRoom(
			String branchId, 
			String device) {
		Integer integerBranchId = Integer.parseInt(branchId);
		this.branchServiceImpl.getById(integerBranchId);
		
		if(branchId != null && device != null && !device.isBlank()) {
			Room room = this.roomService.findRoomByStringId(branchId)
					.orElseThrow(() -> new CustomException("[" + branchId + "번 지점] 현재 촬영 서비스가 준비되지 않았습니다."));
			
			if (room.getCameraClient().entrySet().iterator().next().getKey().equals(device)) {
				roomService.removeCameraClientByName(room, device);
				
				if (room.getCameraClient().size() > 0) {
					System.out.println(String.format("[%s번 지점] %s 사용자님이 퇴장하셨습니다.", branchId, device));
					System.out.println(String.format("[%s번 지점] 현재 촬영 상태 [Device : %s, Client : %s]", 
							branchId, 
							room.getDeviceClient().isEmpty() ? null : room.getDeviceClient().entrySet().iterator().next().getKey(), 
							room.getCameraClient().isEmpty() ? null : room.getCameraClient().entrySet().iterator().next().getKey()));
					
					return enterRoom(branchId, room.getCameraClient().entrySet().iterator().next().getKey());
				}
				return new ResponseEntity<>(
						ResponseDto.of(String.format("[%s번 지점] 촬영이 모두 끝났습니다.", branchId, device)),
						HttpStatus.OK);
			}
			throw new CustomException("해당 Device는 촬영 중이 아닙니다.");
		}
		throw new CustomException("지점 아이디 또는 Device가 잘못됐습니다.");
	}
}