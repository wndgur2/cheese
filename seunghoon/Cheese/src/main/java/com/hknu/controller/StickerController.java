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
import com.hknu.dto.StickerDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.StickerServiceImpl;
import com.hknu.service.TokenService;

@RestController
public class StickerController {
	@Autowired
	private StickerServiceImpl stickerServiceImpl;
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.manager-email}")
    private String manager_email;
	
	// 스티커 추가하기
	@PostMapping(value = "/item/sticker", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<Null>> insertSticker(@RequestParam(required = false) Integer branchId, 
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
					StickerDto stickerDto = new StickerDto(
							this.stickerServiceImpl.getMaxPkValue(),
							branchId, 
							byteImage);
					this.stickerServiceImpl.insert(stickerDto);
				}
				catch (IOException e) {
					return new ResponseEntity<>(
							ResponseDto.of("스티커를 추가하는 중에 오류가 발생했습니다."),
							HttpStatus.INTERNAL_SERVER_ERROR);
				}
				return new ResponseEntity<>(
						ResponseDto.of("성공적으로 스티커를 추가했습니다."),
						HttpStatus.OK);
			}
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
	
	// 스티커 삭제하기
	@DeleteMapping(value = "/item/sticker/{stickerId}")
	public ResponseEntity<ResponseDto<Null>> deleteSticker(@PathVariable Integer stickerId, 
														   @RequestHeader(required = false, value = "Authorization") String accessToken,
														   @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			this.stickerServiceImpl.delete(stickerId);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 스티커를 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
	
	// 스티커 가져오기
	@GetMapping(value = "/item/sticker")
	public ResponseEntity<ResponseDto<List<StickerDto>>> getListFrames(@RequestParam(required = false) Integer branchId,
																	   @RequestHeader(required = false, value = "Authorization") String accessToken,
																	   @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<List<StickerDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		List<StickerDto> stickerDtoList = this.stickerServiceImpl.getListByBranchId(branchId);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 스티커를 가져왔습니다.", stickerDtoList),
				HttpStatus.OK);
	}
	
//	public String getStickerById(Integer id) {
//		return null;
//	}
//	
//	public String getAllStickers() {
//		return null;
//	}
//	
//	
//	public String updateSticker(StickerDto sd) {
//		return null;
//	}
}
