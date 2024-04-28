package com.hknu.service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.hknu.dto.response.ResponseDto;
import com.hknu.exception.CustomException;

@org.springframework.stereotype.Service
public class ManagerService {
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.manager-file.location}")
	private String manager_file_location;
	@Value("${cheese.manager-email}")
    private String manager_email;
	@Value("${cheese.manager-password}")
	private String manager_password;
	
	public ResponseEntity<ResponseDto<NullType>> loginManager(String password) {
		if (manager_password.equals(password)) {
			String accessToken = this.tokenService.generateAccessToken(manager_email);
			String refreshToken = this.tokenService.generateRefreshToken(manager_email);
			
			HttpHeaders headers = new HttpHeaders();
			headers.add("Authorization", "Bearer " + accessToken);
			headers.add("Refresh-Token", "Bearer " + refreshToken);
			
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 로그인 했습니다."), 
					headers, 
					HttpStatus.OK) ;
		} else {
			return new ResponseEntity<>(
					ResponseDto.of("비밀번호가 일치하지 않습니다."), 
					HttpStatus.BAD_REQUEST);
		}
	}
	
	public ResponseEntity<ResponseDto<NullType>> updateManager(
			String password,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			updateManager(password);
			
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 비밀번호를 수정했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
	
	public void updateManager(String password) {
		try {
			FileWriter fileWriter = new FileWriter(new File(manager_file_location), false);
			fileWriter.write(password);
			fileWriter.close();
		} catch (IOException e) {
			throw new CustomException("비밀번호 수정 중에 오류가 발생했습니다.");
		}
	}
}
