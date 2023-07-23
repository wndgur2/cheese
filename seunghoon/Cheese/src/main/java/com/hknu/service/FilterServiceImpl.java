package com.hknu.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.hknu.dao.FilterDaoImpl;
import com.hknu.dto.FilterDto;
import com.hknu.entity.Filter;


@org.springframework.stereotype.Service
public class FilterServiceImpl implements Service<FilterDto>{
	@Autowired
	private FilterDaoImpl filterDaoImpl;
	
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
