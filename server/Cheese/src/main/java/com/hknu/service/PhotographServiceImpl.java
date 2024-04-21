package com.hknu.service;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.hknu.dao.PhotographDaoImpl;
import com.hknu.dto.CustomerDto;
import com.hknu.dto.PhotographDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.entity.Photograph;
import com.hknu.exception.CustomException;
import com.hknu.exception.DoNotMatchImageTypeException;

@org.springframework.stereotype.Service
public class PhotographServiceImpl implements Service<PhotographDto>{
	@Autowired
	private PhotographDaoImpl photographDaoImpl;
	@Autowired
	private CustomerServiceImpl customerServiceImpl;
	@Autowired
	private TokenService tokenService;
	
	// 이미지 파일 여부 확인
	private boolean isImageFile(String contentType) {
	    return contentType != null && (contentType.startsWith("image/jpeg") ||
	                                   contentType.startsWith("image/png") ||
	                                   contentType.startsWith("image/bmp") ||
	                                   contentType.startsWith("image/tiff"));
	}
	
	public ResponseEntity<ResponseDto<List<PhotographDto>>> getCustomerCloudPhotograph(
			Integer customerId, 
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<List<PhotographDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		List<PhotographDto> photographDtoList = getListByCustomerId(customerId);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 모든 사진을 가져왔습니다.", photographDtoList),
				HttpStatus.OK);
	}

	public ResponseEntity<ResponseDto<CustomerDto>> insertCustomerCloudPhotograph(
			Integer customerId, 
			MultipartFile data, 
			Integer branchId,
			String accessToken, 
			String refreshToken) {
		ResponseEntity<ResponseDto<CustomerDto>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		CustomerDto customerDto = null;
		
		if (!data.isEmpty()) {
			byte[] byteData = null;
			
			try {
				byteData = data.getBytes();
				Timestamp date = new Timestamp(System.currentTimeMillis() + (9 * 60 * 60 * 1000));
				
				if (isImageFile(data.getContentType())) {
					PhotographDto photographDto = new PhotographDto(
							getMaxPkValue(), 
							customerId, 
							branchId,
							date, 	
							byteData);
					
					double dataSizeToGB = (double) data.getSize() / 1024 / 1024 / 1024;
					customerDto = this.customerServiceImpl.getById(customerId);
					double setSize = customerDto.getCloudSize() + dataSizeToGB;
					
					if (setSize > 5) {
						return new ResponseEntity<>(
								ResponseDto.of("클라우드 용량이 초과됐습니다."),
								HttpStatus.INTERNAL_SERVER_ERROR);
					}
					insert(photographDto);
					customerDto.setCloudSize(setSize);
					this.customerServiceImpl.update(customerDto);
				} else {
					throw new DoNotMatchImageTypeException();
				}
			} catch (IOException e) {
				return new ResponseEntity<>(
						ResponseDto.of("클라우드에 사진을 추가하는 중에 오류가 발생했습니다."),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			return new ResponseEntity<>(
					ResponseDto.of("클라우드에 추가할 사진을 선택해주세요."),
					HttpStatus.OK);
		}
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 클라우드에 사진을 추가했습니다.", customerDto),
				HttpStatus.OK);
	}
	
	public ResponseEntity<ResponseDto<CustomerDto>> deleteCustomerCloudPhotograph(
			Integer customerId, 
			Integer photoId,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<CustomerDto>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		CustomerDto customerDto = null;
		PhotographDto photographDto = getById(photoId);
		
		if (photographDto.getCustomerId().equals(customerId)) {
			delete(photoId);
			double dataSizeToGB = (double) photographDto.getPhotoImage().length / 1024 / 1024 / 1024;
			customerDto = this.customerServiceImpl.getById(customerId);
			customerDto.setCloudSize(customerDto.getCloudSize() - dataSizeToGB);
			this.customerServiceImpl.update(customerDto);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 클라우드에 사진을 삭제했습니다.", customerDto),
					HttpStatus.OK);
		}
		throw new CustomException("사진과 회원 정보가 일치하지 않습니다.");
	}
	
	public PhotographDto getById(Integer id) {
		Photograph photograph = this.photographDaoImpl.getById(id);
		PhotographDto photographDto = new PhotographDto(
				photograph.getPhotograph_id(),
				photograph.getCustomer_id(),
				photograph.getBranch_id(),
				photograph.getCreated_at(),
				photograph.getPhoto_image());

		return photographDto;
	}
	
	public List<PhotographDto> getAll() {
		List<Photograph> photographList = this.photographDaoImpl.getAll();
		List<PhotographDto> photographDtoList = new ArrayList<>();
		
		for (int i = 0; i < photographList.size(); i++) {
			Photograph photograph = photographList.get(i);
			PhotographDto photographDto = new PhotographDto(
					photograph.getPhotograph_id(),
					photograph.getCustomer_id(),
					photograph.getBranch_id(),
					photograph.getCreated_at(),
					photograph.getPhoto_image());
			photographDtoList.add(photographDto);
		}

		return photographDtoList;
	}
	
	public void insert(PhotographDto pd) {
		Photograph photograph = new Photograph(
				pd.getPhotographId(),
				pd.getCustomerId(), 
				pd.getBranchId(),
				pd.getCreatedAt(),
				pd.getPhotoImage());
		this.photographDaoImpl.insert(photograph);
	}
	
	public void update(PhotographDto pd) {
		Photograph photograph = new Photograph(
				pd.getPhotographId(),
				pd.getCustomerId(), 
				pd.getBranchId(),
				pd.getCreatedAt(),
				pd.getPhotoImage());
		this.photographDaoImpl.update(photograph);
	}
	
	public void delete(Integer id) {
		this.photographDaoImpl.delete(id);
	}
	
	public Integer getMaxPkValue() {
		return this.photographDaoImpl.getMaxPkValue();
	}
	
	public PhotographDto getByPhotoImage(byte[] image) {
		Photograph photograph = this.photographDaoImpl.getByPhotoImage(image);
		PhotographDto photographDto = new PhotographDto(
				photograph.getPhotograph_id(), 
				photograph.getCustomer_id(), 
				photograph.getBranch_id(), 
				photograph.getCreated_at(), 
				photograph.getPhoto_image());
		return photographDto;
	}
	
	public List<PhotographDto> getListByCustomerId(Integer id) {
		List<Photograph> photographList = this.photographDaoImpl.getListByCustomerId(id);
		List<PhotographDto> photographDtoList = new ArrayList<>();
		
		if (photographList == null) {
			return null;
		}
		
		for (int i = 0; i < photographList.size(); i++) {
			Photograph photograph = photographList.get(i);
			PhotographDto photographDto = new PhotographDto(
					photograph.getPhotograph_id(),
					photograph.getCustomer_id(),
					photograph.getBranch_id(),
					photograph.getCreated_at(),
					photograph.getPhoto_image());
			photographDtoList.add(photographDto);
		}
		return photographDtoList;
	}
}