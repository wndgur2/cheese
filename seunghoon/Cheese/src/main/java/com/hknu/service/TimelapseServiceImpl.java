package com.hknu.service;

import java.util.ArrayList;
import java.util.List;

import javax.lang.model.type.NullType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.hknu.dao.TimelapseDaoImpl;
import com.hknu.dto.TimelapseDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.entity.Timelapse;
import com.hknu.exception.CustomException;

@org.springframework.stereotype.Service
public class TimelapseServiceImpl implements Service<TimelapseDto>{
	@Autowired
	private TimelapseDaoImpl timelapseDaoImpl;
	@Autowired
	private TokenService tokenService;
	
	// 타임랩스 파일 여부 확인
	private boolean isVideoFile(String contentType) {
	    return contentType != null && (contentType.startsWith("video/mp4") ||			// MP4
	                                   contentType.startsWith("video/x-msvideo") ||		// AVI
	                                   contentType.startsWith("video/quicktime")) ||	// MOV
	                                   contentType.startsWith("video/x-matroska") ||	// MKV
	                                   contentType.startsWith("video/x-flv") ||			// FLV
	                                   contentType.startsWith("video/webm");			// WebM
	}
	
	public ResponseEntity<ResponseDto<List<TimelapseDto>>> getCustomerCloudData(
			Integer customerId,
			String accessToken, 
			String refreshToken) {
		ResponseEntity<ResponseDto<List<TimelapseDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 모든 타입랩스를 가져왔습니다.", getListByCustomerId(customerId)),
				HttpStatus.OK);
	}
	
	public ResponseEntity<ResponseDto<NullType>> deleteCustomerCloudTimelapse(
			Integer customerId, 
			Integer timelapseId,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		TimelapseDto timelapseDto = getById(timelapseId);
		
		if (timelapseDto.getCustomerId().equals(customerId)) {
			delete(timelapseId);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 클라우드에 타입랩스를 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("타입랩스와 회원 정보가 일치하지 않습니다.");
	}
	
	public TimelapseDto getById(Integer id) {
		Timelapse timelapse = this.timelapseDaoImpl.getById(id);
		TimelapseDto timelapseDto = new TimelapseDto(
				timelapse.getTimelapse_id(),
				timelapse.getCustomer_id(),
				timelapse.getBranch_id(), 
				timelapse.getCreated_at(),
				timelapse.getVideo());

		return timelapseDto;
	}
	
	public List<TimelapseDto> getAll() {
		List<Timelapse> timelapseList = this.timelapseDaoImpl.getAll();
		List<TimelapseDto> timelapseDtoList = new ArrayList<>();
		
		for (int i = 0; i < timelapseList.size(); i++) {
			Timelapse timelapse = timelapseList.get(i);
			TimelapseDto timelapseDto = new TimelapseDto(
					timelapse.getTimelapse_id(),
					timelapse.getCustomer_id(),
					timelapse.getBranch_id(), 
					timelapse.getCreated_at(),
					timelapse.getVideo());
			timelapseDtoList.add(timelapseDto);
		}

		return timelapseDtoList;
	}
	
	public void insert(TimelapseDto td) {
		Timelapse timelapse = new Timelapse(
				td.getTimelapseId(),
				td.getCustomerId(),
				td.getBranchId(),
				td.getCreatedAt(), 
				td.getVideo());
		this.timelapseDaoImpl.insert(timelapse);
	}
	
	public void update(TimelapseDto td) {
		Timelapse timelapse = new Timelapse(
				td.getTimelapseId(),
				td.getCustomerId(),
				td.getBranchId(),
				td.getCreatedAt(), 
				td.getVideo());
		this.timelapseDaoImpl.update(timelapse);
	}
	
	public void delete(Integer id) {
		this.timelapseDaoImpl.delete(id);
	}
	
	public Integer getMaxPkValue() {
		return this.timelapseDaoImpl.getMaxPkValue();
	}
	
	public List<TimelapseDto> getListByCustomerId(Integer id) {
		List<Timelapse> timelapseList = this.timelapseDaoImpl.getListByCustomerId(id);
		List<TimelapseDto> timelapseDtoList = new ArrayList<>();
		
		if (timelapseList == null) {
			return null;
		}
		
		for (int i = 0; i < timelapseList.size(); i++) {
			Timelapse timelapse = timelapseList.get(i);
			TimelapseDto timelapseDto = new TimelapseDto(
					timelapse.getTimelapse_id(),
					timelapse.getCustomer_id(),
					timelapse.getBranch_id(), 
					timelapse.getCreated_at(),
					timelapse.getVideo());
			timelapseDtoList.add(timelapseDto);
		}

		return timelapseDtoList;
	}
}