package com.hknu.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;

import org.apache.tomcat.jakartaee.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
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
import com.hknu.controller.exception.DoNotMatchImageTypeException;
import com.hknu.dto.PhotographDto;
import com.hknu.dto.ShareDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.PhotographServiceImpl;
import com.hknu.service.ShareServiceImpl;
import com.hknu.service.TokenService;

@RestController
public class ShareController {
	@Autowired
	private ShareServiceImpl shareServiceImpl;
	@Autowired
	private PhotographServiceImpl photographServiceImpl;
	@Autowired
	private TokenService tokenService;
	
	// 이미지 파일 여부 확인
	private boolean isImageFile(String contentType) {
	    return contentType != null && (contentType.startsWith("image/jpeg") ||
	                                   contentType.startsWith("image/png") ||
	                                   contentType.startsWith("image/bmp") ||
	                                   contentType.startsWith("image/tiff"));
	}
	
	// 사진 공유하기
	@PostMapping(value = "/share/{customerId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<Null>> insertShare(@PathVariable Integer customerId, 
							  							 @RequestParam List<MultipartFile> photo,
							  							 @RequestHeader(required = false, value = "Authorization") String accessToken,
							  							 @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		HashMap<Integer, PhotographDto> sharedPhotoMap = new HashMap<>();
		Integer sharedPhotoMaxPkValue = this.shareServiceImpl.getSharedPhotoMaxPkValue();
		Integer firstBranchIdFromPhotograph = null;
		
		try {		
			for (int i = 0; i < photo.size(); i++) {
				MultipartFile image = photo.get(i);
				
				if (!image.isEmpty()) {
					byte[] byteImage = null;
					
					if (isImageFile(image.getContentType())) {
						byteImage = image.getBytes();
						PhotographDto photographDto = this.photographServiceImpl.getByPhotoImage(byteImage);
						
						if (!photographDto.getCustomerId().equals(customerId)) {
							throw new CustomException("사진과 회원 정보가 일치하지 않습니다.");
						}
						
						if (i == 0) {
							firstBranchIdFromPhotograph = photographDto.getBranchId();
						}
						else {
							if (photographDto.getBranchId() != firstBranchIdFromPhotograph) {
								throw new CustomException("사진 간의 지점 정보가 일치하지 않습니다.");
							}
						}
						sharedPhotoMap.put(sharedPhotoMaxPkValue + i, photographDto);
					}
					else {
						throw new DoNotMatchImageTypeException();
					}
				}
			}
			Timestamp date = new Timestamp(System.currentTimeMillis() + (9 * 60 * 60 * 1000));
			ShareDto shareDto = new ShareDto(
					this.shareServiceImpl.getShareMaxPkValue(), 
					customerId, 
					firstBranchIdFromPhotograph,
					date, 
					sharedPhotoMap);
			this.shareServiceImpl.insert(shareDto);
		}
		catch (IOException e) {
			return new ResponseEntity<>(
					ResponseDto.of("사진 공유 글을 게시하는 중에 오류가 발생했습니다."),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 사진 공유 글을 게시했습니다."),
				HttpStatus.OK);
	}
	
	// 사진 공유 글 삭제하기
	@DeleteMapping(value = "/share/{customerId}/{shareId}")
	public ResponseEntity<ResponseDto<Null>> deleteShare(@PathVariable Integer customerId, 
														 @PathVariable Integer shareId, 
														 @RequestHeader(required = false, value = "Authorization") String accessToken,
														 @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		ShareDto shareDto = this.shareServiceImpl.getById(shareId);
		if (shareDto.getCustomerId().equals(customerId)) {
			this.shareServiceImpl.delete(shareId);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 사진 공유 글을 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("사진 공유 글과 회원 정보가 일치하지 않습니다.");
	}
	
	// 내가 공유한 사진 공유 글 조회하기
	@GetMapping(value = "/share/{customerId}")
	public ResponseEntity<ResponseDto<List<ShareDto>>> getShareByCustomerId(@PathVariable Integer customerId, 
																			@RequestHeader(required = false, value = "Authorization") String accessToken, 
																			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<List<ShareDto>>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		List<ShareDto> shareDtoList = this.shareServiceImpl.getListByCustomerId(customerId);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 내가 공유한 모든 사진 공유 글을 가져왔습니다.", shareDtoList),
				HttpStatus.OK);
	}
	
	// 사진 공유 글 조회하기, 지점별 사진 공유 글 조회하기
	@GetMapping(value = "/share/page/{index}")
	public ResponseEntity<ResponseDto<List<ShareDto>>> getListShares(@PathVariable Integer index, 
																	 @RequestParam(required = false) Integer branchId) {
		if (index < 1) {
			throw new CustomException("인덱스 값은 1 이상이어야 합니다.");
		}
		
		List<ShareDto> shareDtoList = this.shareServiceImpl.getListByBranchIdAndIndex(index, branchId);
		
		return new ResponseEntity<>(
				ResponseDto.of(String.format("성공적으로 최근 %d 번째부터 10개의 사진 공유 글을 가져왔습니다.", (index - 1) * 10 + 1), shareDtoList),
				HttpStatus.OK);
	}
	
//	public String getShareById(Integer id) {
//		return null;
//	}
//
//	public String getAllShares() {
//		return null;
//	}
//
//	public String updateShare(ShareDto sd) {
//		return null;
//	}
}
