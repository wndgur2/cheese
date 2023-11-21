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

import com.hknu.dao.FrameDaoImpl;
import com.hknu.dto.FrameDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.entity.Frame;
import com.hknu.exception.CustomException;

@org.springframework.stereotype.Service
public class FrameServiceImpl implements Service<FrameDto>{
	@Autowired
	private FrameDaoImpl frameDaoImpl;
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.manager-email}")
    private String manager_email;
	
	public ResponseEntity<ResponseDto<NullType>> insertFrame(
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
					FrameDto frameDto = new FrameDto(
							getMaxPkValue(),
							branchId,
							byteImage);
					insert(frameDto);
				} catch (IOException e) {
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
		

	public ResponseEntity<ResponseDto<NullType>> deleteFrame(
			Integer frameId, 
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);

		if (responseEntity != null) {
			return responseEntity;
		}

		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			delete(frameId);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 프레임을 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
		
	public ResponseEntity<ResponseDto<List<FrameDto>>> getListFrames(
			Integer branchId, 
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<List<FrameDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);

		if (responseEntity != null) {
			return responseEntity;
		}

		List<FrameDto> frameDtoList = getListByBranchId(branchId);

		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 프레임을 가져왔습니다.", frameDtoList),
				HttpStatus.OK);
	}
	
	public FrameDto getById(Integer id) {
		Frame frame = this.frameDaoImpl.getById(id);
		FrameDto frameDto = new FrameDto(
				frame.getFrame_id(),
				frame.getBranch_id(),
				frame.getFrame_image());

		return frameDto;
	}
	
	public List<FrameDto> getAll() {
		List<Frame> frameList = this.frameDaoImpl.getAll();
		List<FrameDto> frameDtoList = new ArrayList<>();
		
		for (int i = 0; i < frameList.size(); i++) {
			Frame frame = frameList.get(i);
			FrameDto frameDto = new FrameDto(
					frame.getFrame_id(),
					frame.getBranch_id(),
					frame.getFrame_image());
			frameDtoList.add(frameDto);
		}

		return frameDtoList;
	}
	
	public void insert(FrameDto fd) {
		Frame frame = new Frame(
				fd.getFrameId(),
				fd.getBranchId(),
				fd.getFrameImage());
		this.frameDaoImpl.insert(frame);
	}
	
	public void update(FrameDto fd) {
		Frame frame = new Frame(
				fd.getFrameId(),
				fd.getBranchId(),
				fd.getFrameImage());
		this.frameDaoImpl.update(frame);
	}
	
	public void delete(Integer id) {
		this.frameDaoImpl.delete(id);
	}
	
	public Integer getMaxPkValue() {
		return this.frameDaoImpl.getMaxPkValue();
	}
	
	public List<FrameDto> getListByBranchId(Integer id) {
		List<Frame> frameList = this.frameDaoImpl.getListByBranchId(id);
		List<FrameDto> frameDtoList = new ArrayList<>();
		
		if (frameList == null) {
			return null;
		}
		
		for (int i = 0; i < frameList.size(); i++) {
			Frame frame = frameList.get(i);
			FrameDto frameDto = new FrameDto(
					frame.getFrame_id(),
					frame.getBranch_id(),
					frame.getFrame_image());
			frameDtoList.add(frameDto);
		}

		return frameDtoList;
	}
}