package com.hknu.controller;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hknu.dto.response.ResponseDto;
import com.hknu.service.CameraService;

@RestController
public class CameraController {
	@Autowired
	private CameraService cameraService;
	
	// 미러링 시작하기
	@PostMapping(value = "/branch/{branchId}/stream")
	public ResponseEntity<ResponseDto<NullType>> enterRoom(
			@PathVariable String branchId, 
			@RequestParam String device) {
		return this.cameraService.enterRoom(branchId, device);
	}
	
	// 미러링 종료하기
	@DeleteMapping("/branch/{branchId}/stream")
	public ResponseEntity<ResponseDto<NullType>> exitRoom(
			@PathVariable String branchId, 
			@RequestParam String device) {
		return this.cameraService.exitRoom(branchId, device);
	}
}
