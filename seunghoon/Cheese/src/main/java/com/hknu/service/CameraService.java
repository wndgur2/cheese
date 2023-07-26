package com.hknu.service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.tomcat.jakartaee.commons.lang3.ObjectUtils.Null;
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
//    private static final String REDIRECT = "redirect:/";
    @Autowired
    private RoomService roomService;
    @Autowired
    private BranchServiceImpl branchServiceImpl;
    @Autowired
    private Parser parser;
    private static ConcurrentHashMap<Integer, Boolean> cameraStatus = new ConcurrentHashMap<>();
    
    private Boolean getCameraStatus(String branchId) {
    	if (cameraStatus.get(Integer.parseInt(branchId)) == null) {
    		cameraStatus.put(Integer.parseInt(branchId), true);
    		return true;
    	}
    	else {
    		return cameraStatus.get(Integer.parseInt(branchId));
    	}
    }
    
    private void setCameraStatus(String branchId, 
    							 Boolean status) {
    	cameraStatus.put(Integer.parseInt(branchId), status);
    }
    
    // test
    public void test() {
    	Set<Room> rooms = this.roomService.getRooms();
    	
    	for (Room room : rooms) {
    		System.out.println(String.format("Room ID : ", room.getId()));
    	}
    }
    
    public ResponseEntity<ResponseDto<Null>> enterRoom(String branchId, 
    												   String device) {	
        if (parser.parseId(branchId).isPresent()) {
        	this.branchServiceImpl.getById(Integer.parseInt(branchId));
        	
        	if (!getCameraStatus(branchId)) {
        		throw new CustomException("[%s번 지점] 현재 다른 사용자가 촬영 중입니다.");
        	}
        	
            Room room = roomService.findRoomByStringId(branchId).orElse(null);
            
            if (room == null) {
            	roomService.addRoom(new Room(Integer.parseInt(branchId)));
            }
            
            if(device != null && !device.isEmpty()) {
            	if (this.branchServiceImpl.checkNextElementFromQueue(Integer.parseInt(branchId), false).equals(device)) {
            		setCameraStatus(branchId, true);
            		this.branchServiceImpl.deQueue(Integer.parseInt(branchId), false);
            		
            		System.out.println(String.format("User {} is going to join Room #{}", device, branchId));
            		return new ResponseEntity<>(
            				ResponseDto.of(String.format("[%s번 지점] %s 사용자님이 촬영 시작합니다.", branchId, device)),
            				HttpStatus.OK);
            	}
            	throw new CustomException(String.format("[%s번 지점] %s 사용자님의 차례가 아닙니다.", branchId, device));
            }
            else {
                throw new CustomException("Device가 주어지지 않았습니다.");
            }
        }
        throw new CustomException("지점 아이디가 주어지지 않았습니다.");
    }

    public ResponseEntity<ResponseDto<Null>> exitRoom(String branchId, 
    												  String device) {
    	Integer integerBranchId = Integer.parseInt(branchId);
    	this.branchServiceImpl.getById(integerBranchId);
    	
    	if(branchId != null && device != null) {
    		if (this.branchServiceImpl.checkNextElementFromQueue(Integer.parseInt(branchId), false) != null) {
        		System.out.println(String.format("User {} has left Room #{}", device, branchId));
        		
        		setCameraStatus(branchId, false);
        		
        		return enterRoom(branchId, this.branchServiceImpl.checkNextElementFromQueue(Integer.parseInt(branchId), false));
    		}
    		return new ResponseEntity<>(
    				ResponseDto.of(String.format("[%s번 지점] 촬영이 모두 끝났습니다.", branchId, device)),
    				HttpStatus.OK);
        }
    	throw new CustomException("지점 아이디 또는 Device가 잘못됐습니다.");
    }
}