package com.hknu.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.hknu.dao.StickerDaoImpl;
import com.hknu.dto.StickerDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.entity.Sticker;
import com.hknu.exception.CustomException;

@org.springframework.stereotype.Service
public class StickerServiceImpl implements Service<StickerDto>{
	@Autowired
	private StickerDaoImpl stickerDaoImpl;
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.manager-email}")
    private String manager_email;
	
	public ResponseEntity<ResponseDto<NullType>> insertSticker(
			Integer branchId, 
			MultipartFile image,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
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
							getMaxPkValue(),
							branchId, 
							byteImage);
					insert(stickerDto);
				} catch (IOException e) {
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
	
	public ResponseEntity<ResponseDto<NullType>> deleteSticker(
			Integer stickerId, 
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			delete(stickerId);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 스티커를 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
	
	public ResponseEntity<ResponseDto<List<StickerDto>>> getListStickers(
			Integer branchId,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<List<StickerDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 스티커를 가져왔습니다.", getListByBranchId(branchId)),
				HttpStatus.OK);
	}
	
	public StickerDto getById(Integer id) {
		Sticker sticker = this.stickerDaoImpl.getById(id);
		StickerDto stickerDto = new StickerDto(
				sticker.getSticker_id(),
				sticker.getBranch_id(),
				sticker.getSticker_image());

		return stickerDto;
	}
	
	public List<StickerDto> getAll() {
		List<Sticker> stickerList = this.stickerDaoImpl.getAll();
		List<StickerDto> stickerDtoList = new ArrayList<>();
		
		for (int i = 0; i < stickerList.size(); i++) {
			Sticker sticker = stickerList.get(i);
			StickerDto stickerDto = new StickerDto(
					sticker.getSticker_id(),
					sticker.getBranch_id(),
					sticker.getSticker_image());
			stickerDtoList.add(stickerDto);
		}

		return stickerDtoList;
	}
	
	public List<StickerDto> getListByBranchId(Integer id) {
		List<Sticker> stickerList = this.stickerDaoImpl.getListByBranchId(id);
		List<StickerDto> stickerDtoList = new ArrayList<>();
		
		if (stickerList == null) {
			return null;
		}
		
		for (int i = 0; i < stickerList.size(); i++) {
			Sticker sticker = stickerList.get(i);
			StickerDto stickerDto = new StickerDto(
					sticker.getSticker_id(),
					sticker.getBranch_id(),
					sticker.getSticker_image());
			stickerDtoList.add(stickerDto);
		}

		return stickerDtoList;
	}
	
	public Integer getMaxPkValue() {
		return this.stickerDaoImpl.getMaxPkValue();
	}
	
	public void insert(StickerDto sd) {
		Sticker sticker = new Sticker(
				sd.getStickerId(),
				sd.getBranchId(),
				sd.getStickerImage());
		this.stickerDaoImpl.insert(sticker);
	}
	
	public void update(StickerDto sd) {
		Sticker sticker = new Sticker(
				sd.getStickerId(),
				sd.getBranchId(),
				sd.getStickerImage());
		this.stickerDaoImpl.update(sticker);
	}
	
	public void delete(Integer id) {
		this.stickerDaoImpl.delete(id);
	}
}