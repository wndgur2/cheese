package com.hknu.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.hknu.dao.TimelapseDaoImpl;
import com.hknu.dto.TimelapseDto;
import com.hknu.entity.Timelapse;

@org.springframework.stereotype.Service
public class TimelapseServiceImpl implements Service<TimelapseDto>{
	@Autowired
	private TimelapseDaoImpl timelapseDaoImpl;
	
	public TimelapseDto getById(int id) {
		Timelapse timelapse = this.timelapseDaoImpl.getById(id);
		TimelapseDto timelapseDto = new TimelapseDto(
				timelapse.getTimelapse_id(),
				timelapse.getCustomer_id(),
				null, 
				timelapse.getCreated_at(),
				timelapse.getVideo());
		// test
		System.out.println(timelapseDto.toString());
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
					null, 
					timelapse.getCreated_at(),
					timelapse.getVideo());
			timelapseDtoList.add(timelapseDto);
		}
		//test
		System.out.println(timelapseDtoList.toString());
		return timelapseDtoList;
	}
	
	public void insert(TimelapseDto td) {
		Timelapse timelapse = new Timelapse(
				td.getTimelapseId(),
				td.getCustomerId(),
				td.getCreatedAt(), 
				td.getVideo());
		this.timelapseDaoImpl.insert(timelapse);
	}
	
	public void update(TimelapseDto td) {
		Timelapse timelapse = new Timelapse(
				td.getTimelapseId(),
				td.getCustomerId(),
				td.getCreatedAt(), 
				td.getVideo());
		this.timelapseDaoImpl.update(timelapse);
	}
	
	public void delete(int id) {
		this.timelapseDaoImpl.delete(id);
	}
}