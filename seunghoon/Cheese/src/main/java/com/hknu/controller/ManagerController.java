package com.hknu.controller;

import org.apache.tomcat.jakartaee.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hknu.controller.exception.CustomException;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.ManagerService;
import com.hknu.service.TokenService;

@RestController
public class ManagerController {
	@Autowired
	private ManagerService managerService;
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.manager-email}")
    private String manager_email;
	
	// 관리자 로그인
	@PostMapping(value = "/manager")
	public ResponseEntity<ResponseDto<Null>> loginManager(@RequestParam String password) {
		String managerPassword = this.managerService.getManagerByPassword(password);
		
		if (managerPassword.equals(password)) {
			String accessToken = this.tokenService.generateAccessToken(manager_email);
			String refreshToken = this.tokenService.generateRefreshToken(manager_email);
			
			HttpHeaders headers = new HttpHeaders();
			headers.add("Authorization", "Bearer " + accessToken);
			headers.add("Refresh-Token", "Bearer " + refreshToken);
			
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 로그인 했습니다."), 
					headers, 
					HttpStatus.OK) ;
		}
		else {
			return new ResponseEntity<>(
					ResponseDto.of("비밀번호가 일치하지 않습니다."), 
					HttpStatus.BAD_REQUEST);
		}
	}
	
	// 관리자 비밀번호 수정하기
	@PutMapping(value = "/manager")
	public ResponseEntity<ResponseDto<Null>> updateManager(@RequestParam String password,
														   @RequestHeader(required = false, value = "Authorization") String accessToken,
														   @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			this.managerService.updateManager(password);
			
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 비밀번호를 수정했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
}
