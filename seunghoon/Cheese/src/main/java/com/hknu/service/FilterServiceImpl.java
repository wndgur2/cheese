package com.hknu.service;

import java.util.ArrayList;
import java.util.List;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.hknu.dao.FilterDaoImpl;
import com.hknu.dto.FilterDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.entity.Filter;
import com.hknu.exception.CustomException;


@org.springframework.stereotype.Service
public class FilterServiceImpl implements Service<FilterDto>{
	@Autowired
	private FilterDaoImpl filterDaoImpl;
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.manager-email}")
    private String manager_email;
	
	public ResponseEntity<ResponseDto<NullType>> insertFilter(
			Integer branchId,
			Integer brightness,
			Integer exposure,
			Integer contrast,
			Integer chroma,
			Integer temperature,
			Integer livliness,
			Integer tint,
			Integer tone,
			Integer highlight,
			Integer shadow,
			Integer sharpness,
			Integer grain,
			Integer vineting,
			Integer afterImage,
			Integer dehaze,
			Integer posterize,
			Integer blur,
			Integer mosaic,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);

		if (responseEntity != null) {
			return responseEntity;
		}

		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			FilterDto filterDto = new FilterDto(
					getMaxPkValue(),
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
			insert(filterDto);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 필터를 추가했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
	
	public ResponseEntity<ResponseDto<NullType>> deleteFilter(
			Integer filterId,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			delete(filterId);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 필터를 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
	
	
	public ResponseEntity<ResponseDto<List<FilterDto>>> getListFilters(
			Integer branchId,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<List<FilterDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		List<FilterDto> filterDtoList = getListByBranchId(branchId);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 필터를 가져왔습니다.", filterDtoList),
				HttpStatus.OK);
	}
	
	public FilterDto getById(Integer id) {
		Filter filter = this.filterDaoImpl.getById(id);
		FilterDto filterDto = new FilterDto(
				filter.getFilter_id(),
				filter.getBranch_id(),
				filter.getBrightness(),
				filter.getExposure(), 
				filter.getContrast(),
				filter.getChroma(),
				filter.getTemperature(),
				filter.getLivliness(),
				filter.getTint(),
				filter.getTone(),
				filter.getHighlight(),
				filter.getShadow(),
				filter.getSharpness(),
				filter.getGrain(),
				filter.getVineting(),
				filter.getAfterImage(),
				filter.getDehaze(),
				filter.getPosterize(),
				filter.getBlur(),
				filter.getMosaic());

		return filterDto;
	}
	
	public List<FilterDto> getAll() {
		List<Filter> filterList = this.filterDaoImpl.getAll();
		List<FilterDto> filterDtoList = new ArrayList<>();
		
		for (int i = 0; i < filterList.size(); i++) {
			Filter filter = filterList.get(i);
			FilterDto filterDto = new FilterDto(
					filter.getFilter_id(),
					filter.getBranch_id(),
					filter.getBrightness(),
					filter.getExposure(), 
					filter.getContrast(),
					filter.getChroma(),
					filter.getTemperature(),
					filter.getLivliness(),
					filter.getTint(),
					filter.getTone(),
					filter.getHighlight(),
					filter.getShadow(),
					filter.getSharpness(),
					filter.getGrain(),
					filter.getVineting(),
					filter.getAfterImage(),
					filter.getDehaze(),
					filter.getPosterize(),
					filter.getBlur(),
					filter.getMosaic());
			filterDtoList.add(filterDto);
		}

		return filterDtoList;
	}
	
	public void insert(FilterDto fd) {
		Filter filter = new Filter(
				fd.getFilterId(),
				fd.getBranchId(),
				fd.getBrightness(),
				fd.getExposure(), 
				fd.getContrast(),
				fd.getChroma(),
				fd.getTemperature(),
				fd.getLivliness(),
				fd.getTint(),
				fd.getTone(),
				fd.getHighlight(),
				fd.getShadow(),
				fd.getSharpness(),
				fd.getGrain(),
				fd.getVineting(),
				fd.getAfterImage(),
				fd.getDehaze(),
				fd.getPosterize(),
				fd.getBlur(),
				fd.getMosaic());
		this.filterDaoImpl.insert(filter);
	}
	
	public void update(FilterDto fd) {
		Filter filter = new Filter(
				fd.getFilterId(),
				fd.getBranchId(),
				fd.getBrightness(),
				fd.getExposure(), 
				fd.getContrast(),
				fd.getChroma(),
				fd.getTemperature(),
				fd.getLivliness(),
				fd.getTint(),
				fd.getTone(),
				fd.getHighlight(),
				fd.getShadow(),
				fd.getSharpness(),
				fd.getGrain(),
				fd.getVineting(),
				fd.getAfterImage(),
				fd.getDehaze(),
				fd.getPosterize(),
				fd.getBlur(),
				fd.getMosaic());
		this.filterDaoImpl.update(filter);
	}
	
	public void delete(Integer id) {
		this.filterDaoImpl.delete(id);
	}

	public Integer getMaxPkValue() {
		return this.filterDaoImpl.getMaxPkValue();
	}
	
	public List<FilterDto> getListByBranchId(Integer id) {
		List<Filter> filterList = this.filterDaoImpl.getListByBranchId(id);
		List<FilterDto> filterDtoList = new ArrayList<>();
		
		if (filterList == null) {
			return null;
		}
		
		for (int i = 0; i < filterList.size(); i++) {
			Filter filter = filterList.get(i);
			FilterDto filterDto = new FilterDto(
					filter.getFilter_id(),
					filter.getBranch_id(),
					filter.getBrightness(),
					filter.getExposure(), 
					filter.getContrast(),
					filter.getChroma(),
					filter.getTemperature(),
					filter.getLivliness(),
					filter.getTint(),
					filter.getTone(),
					filter.getHighlight(),
					filter.getShadow(),
					filter.getSharpness(),
					filter.getGrain(),
					filter.getVineting(),
					filter.getAfterImage(),
					filter.getDehaze(),
					filter.getPosterize(),
					filter.getBlur(),
					filter.getMosaic());
			filterDtoList.add(filterDto);
		}

		return filterDtoList;
	}
}
