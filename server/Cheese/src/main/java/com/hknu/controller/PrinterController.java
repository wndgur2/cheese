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
import com.hknu.service.PrinterService;

@RestController
public class PrinterController {
	@Autowired
	private PrinterService printerService;
	
	// 인화 시작하기
	@PostMapping(value = "/branch/{branchId}/print")
	public ResponseEntity<ResponseDto<NullType>> enterRoom(
			@PathVariable String branchId,
			@RequestParam String device) {
		return this.printerService.enterRoom(branchId, device);
	}
	
	// 인화 종료하기
	@DeleteMapping("/branch/{branchId}/print")
	public ResponseEntity<ResponseDto<NullType>> exitRoom(
			@PathVariable String branchId, 
			@RequestParam String device) {
		return this.printerService.exitRoom(branchId, device);
	}
}
