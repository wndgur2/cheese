package com.hknu.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.hknu.dao.FrameDaoImpl;
import com.hknu.dto.FrameDto;
import com.hknu.entity.Frame;

@org.springframework.stereotype.Service
public class FrameServiceImpl implements Service<FrameDto>{
	@Autowired
	private FrameDaoImpl frameDaoImpl;
	
	public FrameDto getById(int id) {
		Frame frame = this.frameDaoImpl.getById(id);
		FrameDto frameDto = new FrameDto(
				frame.getFrame_id(),
				frame.getFrame_image());
		// test
		System.out.println(frameDto.toString());
		return frameDto;
	}
	
	public List<FrameDto> getAll() {
		List<Frame> frameList = this.frameDaoImpl.getAll();
		List<FrameDto> frameDtoList = new ArrayList<>();
		
		for (int i = 0; i < frameList.size(); i++) {
			Frame frame = frameList.get(i);
			FrameDto frameDto = new FrameDto(
					frame.getFrame_id(),
					frame.getFrame_image());
			frameDtoList.add(frameDto);
		}
		//test
		System.out.println(frameDtoList.toString());
		return frameDtoList;
	}
	
	public void insert(FrameDto fd) {
		Frame frame = new Frame(
				fd.getFrameId(),
				fd.getFrameImage());
		this.frameDaoImpl.insert(frame);
	}
	
	public void update(FrameDto fd) {
		Frame frame = new Frame(
				fd.getFrameId(),
				fd.getFrameImage());
		this.frameDaoImpl.update(frame);
	}
	
	public void delete(int id) {
		this.frameDaoImpl.delete(id);
	}
}