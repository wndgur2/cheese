package com.hknu.controller;

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

import com.hknu.controller.exception.CustomException;
import com.hknu.dto.FilterDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.FilterServiceImpl;
import com.hknu.service.TokenService;

@RestController
public class FilterController {
	@Autowired
	private FilterServiceImpl filterServiceImpl;
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.manager-email}")
    private String manager_email;
	
	// 필터 추가하기
	@PostMapping(value = "/item/filter", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<Null>> insertFilter(@RequestParam(required = false) Integer branchId,
							   							  @RequestParam Integer brightness,
							   							  @RequestParam Integer exposure,
							   							  @RequestParam Integer contrast,
							   							  @RequestParam Integer chroma,
							   							  @RequestParam Integer temperature,
							   							  @RequestParam Integer livliness,
							   							  @RequestParam Integer tint,
							   							  @RequestParam Integer tone,
							   							  @RequestParam Integer highlight,
							   							  @RequestParam Integer shadow,
							   							  @RequestParam Integer sharpness,
							   							  @RequestParam Integer grain,
							   							  @RequestParam Integer vineting,
							   							  @RequestParam Integer afterImage,
							   							  @RequestParam Integer dehaze,
							   							  @RequestParam Integer posterize,
							   							  @RequestParam Integer blur,
							   							  @RequestParam Integer mosaic,
							   							  @RequestHeader(required = false, value = "Authorization") String accessToken,
							   							  @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			FilterDto filterDto = new FilterDto(
					this.filterServiceImpl.getMaxPkValue(),
					branchId, 
					brightness, 
					exposure, 
					contrast, 
					chroma, 
					temperature, 
					livliness, 
					tint, 
					tone, 
					highlight, 
					shadow, 
					sharpness, 
					grain, 
					vineting, 
					afterImage, 
					dehaze, 
					posterize, 
					blur, 
					mosaic);
			this.filterServiceImpl.insert(filterDto);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 필터를 추가했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
	
	// 필터 삭제하기
	@DeleteMapping(value = "/item/filter/{filterId}")
	public ResponseEntity<ResponseDto<Null>> deleteFilter(@PathVariable Integer filterId,
														  @RequestHeader(required = false, value = "Authorization") String accessToken,
														  @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			this.filterServiceImpl.delete(filterId);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 필터를 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
	
	// 필터 가져오기
	@GetMapping(value = "/item/filter")
	public ResponseEntity<ResponseDto<List<FilterDto>>> getListFilters(@RequestParam(required = false) Integer branchId,
																	   @RequestHeader(required = false, value = "Authorization") String accessToken,
																	   @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<List<FilterDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		List<FilterDto> filterDtoList = this.filterServiceImpl.getListByBranchId(branchId);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 필터를 가져왔습니다.", filterDtoList),
				HttpStatus.OK);
	}
	
//	public String getFilterById(Integer id) {
//		return null;
//	}
//	
//	public String getAllFilters() {
//		return null;
//	}
//	
//	public String updateFilter(FilterDto fd) {
//		return null;
//	}
}
