package com.hknu.controller;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hknu.dto.response.ResponseDto;
import com.hknu.service.ManagerService;

@RestController
public class ManagerController {
	@Autowired
	private ManagerService managerService;
	
	// 관리자 로그인
	@PostMapping(value = "/manager")
	public ResponseEntity<ResponseDto<NullType>> loginManager(@RequestParam String password) {
		return this.managerService.loginManager(password);
	}
	
	// 관리자 비밀번호 수정하기
	@PutMapping(value = "/manager")
	public ResponseEntity<ResponseDto<NullType>> updateManager(
			@RequestParam String password,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.managerService.updateManager(password, accessToken, refreshToken);
	}
}
