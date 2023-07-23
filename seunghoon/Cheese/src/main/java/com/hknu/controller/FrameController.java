package com.hknu.controller;

import java.io.IOException;
import java.util.List;

import org.apache.tomcat.jakartaee.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hknu.controller.exception.CustomException;
import com.hknu.dto.FrameDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.FrameServiceImpl;
import com.hknu.service.TokenService;

@RestController
public class FrameController {
	@Autowired
	private FrameServiceImpl frameServiceImpl;
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.manager-email}")
    private String manager_email;
	
	// 프레임 추가하기
	@PostMapping(value = "/item/frame", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<Null>> insertFrame(@RequestParam(required = false) Integer branchId, 
														 @RequestParam MultipartFile image,
														 @RequestHeader(required = false, value = "Authorization") String accessToken,
														 @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			if (!image.isEmpty()) {
				byte[] byteImage = null;
			
				try {
					byteImage = image.getBytes();
					FrameDto frameDto = new FrameDto(
							this.frameServiceImpl.getMaxPkValue(),
							branchId,
							byteImage);
					this.frameServiceImpl.insert(frameDto);
				}
				catch (IOException e) {
					return new ResponseEntity<>(
							ResponseDto.of("프레임을 추가하는 중에 오류가 발생했습니다."),
							HttpStatus.INTERNAL_SERVER_ERROR);
				}
				return new ResponseEntity<>(
						ResponseDto.of("성공적으로 프레임을 추가했습니다."),
						HttpStatus.OK);
			}
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
	
	// 프레임 삭제하기
	@DeleteMapping(value = "/item/frame/{frameId}")
	public ResponseEntity<ResponseDto<Null>> deleteFrame(@PathVariable Integer frameId, 
														 @RequestHeader(required = false, value = "Authorization") String accessToken,
														 @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			this.frameServiceImpl.delete(frameId);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 프레임을 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
	
	// 프레임 가져오기
	@GetMapping(value = "/item/frame")
	public ResponseEntity<ResponseDto<List<FrameDto>>> getListFrames(@RequestParam(required = false) Integer branchId, 
																     @RequestHeader(required = false, value = "Authorization") String accessToken,
																     @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<List<FrameDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		List<FrameDto> frameDtoList = this.frameServiceImpl.getListByBranchId(branchId);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 프레임을 가져왔습니다.", frameDtoList),
				HttpStatus.OK);
	}
	
	public String getFrameById(Integer id) {
		return null;
	}
	
	public String getAllFrames() {
		return null;
	}
	
	public String updateFrame(FrameDto fd) {
		return null;
	}
}
