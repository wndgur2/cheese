package com.hknu.service;

import java.util.concurrent.ConcurrentHashMap;

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
//    private static final String REDIRECT = "redirect:/";
    @Autowired
    private RoomService roomService;
    @Autowired
    private BranchServiceImpl branchServiceImpl;
    @Autowired
    private Parser parser;
    private static ConcurrentHashMap<Integer, String[]> cameraStatus = new ConcurrentHashMap<>();
    private Boolean carmeraOrPrint = false;
    
    private Boolean getCameraStatus(String branchId) {
    	if (cameraStatus.get(Integer.parseInt(branchId)) == null) {
    		String[] array = new String[2];
    		array[0] = null;
    		array[1] = null;
    		cameraStatus.put(Integer.parseInt(branchId), array);
    		return true;
    	} else {
    		String[] array = cameraStatus.get(Integer.parseInt(branchId));
    		
    		for (String arrayDevice : array) {
    			if (arrayDevice == null || arrayDevice.isEmpty()) return true;
    		}
    		return false;
    	}
    }
    
    private void insertCameraStatus(
    		String branchId, 
    		String device) {
    	String[] array = cameraStatus.get(Integer.parseInt(branchId));
    	int index = 0;
    	
    	if (device != null && !device.isEmpty()) {
        	for (index = 0; index < array.length; index++) {
        		if (array[index] == null || array[index].isEmpty()) {
        			cameraStatus.get(Integer.parseInt(branchId))[index] = device;
        			System.out.println(String.format("[입장] 현재 촬영 Device : [%s, %s]", array[0], array[1]));
        			return;
        		}
        	}
    	} 
    	throw new CustomException("[" + branchId + "번 지점] 현재 촬영 중입니다.");
    }
    
    private void deleteCameraStatus(
    		String branchId, 
    		String device) {
    	String[] array = cameraStatus.get(Integer.parseInt(branchId));
    	int index = 0;
    	
    	if (device != null && !device.isEmpty()) {
        	for (index = array.length - 1; index >= 0; index--) {
        		if (array[index] != null && !array[index].isEmpty() && array[index].equals(device)) {
        			cameraStatus.get(Integer.parseInt(branchId))[index] = null;
        			System.out.println(String.format("[퇴장] 현재 촬영 Device : [%s, %s]", array[0], array[1]));
        			return;
        		}
        	}
    	}
    	throw new CustomException("[" + branchId + "%s번 지점] 현재 촬영 중이 아닙니다.");
    }
    
    public ResponseEntity<ResponseDto<NullType>> enterRoom(
    		String branchId, 
    		String device) {
        if (parser.parseId(branchId).isPresent()) {
        	this.branchServiceImpl.getById(Integer.parseInt(branchId));
        	
        	if (!getCameraStatus(branchId)) {
        		throw new CustomException("[" + branchId + "번 지점] 현재 다른 사용자가 촬영 중입니다.");
        	}
        	
            Room room = roomService.findRoomByStringId(branchId).orElse(null);
            
            if (room == null) {
            	roomService.addRoom(new Room(Integer.parseInt(branchId)));
            }
            
            if(device != null && !device.isEmpty()) {
            	if (this.branchServiceImpl.checkNextElementFromQueue(Integer.parseInt(branchId), carmeraOrPrint).equals(device)) {
            		insertCameraStatus(branchId, device);
            		this.branchServiceImpl.deCameraQueue(Integer.parseInt(branchId), device);
            		
            		System.out.println(String.format("[%s번 지점] %s 사용자님이 입장하셨습니다.", branchId, device));
            		return new ResponseEntity<>(
            				ResponseDto.of(String.format("[%s번 지점] %s 사용자님이 촬영 시작합니다.", branchId, device)),
            				HttpStatus.OK);
            	}
            	throw new CustomException("[" + branchId + "번 지점] " + device + " 사용자님의 차례가 아닙니다.");
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
    	
    	if(branchId != null && device != null && !device.isEmpty()) {
    		boolean isExist = false;
    		String[] array = cameraStatus.get(Integer.parseInt(branchId));
    		for (String arrayDevice : array) {
    			if (arrayDevice.equals(device)) isExist = true;
    		}
    		
    		if (isExist) {
    			deleteCameraStatus(branchId, device);
    			
        		if (this.branchServiceImpl.checkNextElementFromQueue(Integer.parseInt(branchId), carmeraOrPrint) != null) {
            		System.out.println(String.format("[%s번 지점] %s 사용자님이 퇴장하셨습니다.", branchId, device));
            		
            		return enterRoom(branchId, this.branchServiceImpl.checkNextElementFromQueue(Integer.parseInt(branchId), carmeraOrPrint));
        		}
        		return new ResponseEntity<>(
        				ResponseDto.of(String.format("[%s번 지점] 촬영이 모두 끝났습니다.", branchId, device)),
        				HttpStatus.OK);
    		}
        }
    	throw new CustomException("지점 아이디 또는 Device가 잘못됐습니다.");
    }
}