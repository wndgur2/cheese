package com.hknu.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;

import com.hknu.dao.ShareDaoImpl;
import com.hknu.dao.SharedPhotoDaoImpl;
import com.hknu.dto.PhotographDto;
import com.hknu.dto.ShareDto;
import com.hknu.entity.Share;
import com.hknu.entity.SharedPhoto;

@org.springframework.stereotype.Service
public class ShareServiceImpl implements Service<ShareDto>{
	@Autowired
	private ShareDaoImpl shareDaoImpl;
	@Autowired
	private SharedPhotoDaoImpl sharedPhotoDaoImpl;
	@Autowired
	private PhotographServiceImpl photographServiceImpl;
	
	public ShareDto getById(Integer id) {
		Share share = this.shareDaoImpl.getById(id);
		List<SharedPhoto> sharedPhotoList = this.sharedPhotoDaoImpl.getListByShareId(id);
		ShareDto shareDto = new ShareDto(
				share.getShare_id(),
				share.getCustomer_id(), 
				share.getBranch_id(),
				share.getCreated_at(),
				null);
		
		if (sharedPhotoList == null) {
			return shareDto;
		}
		
		HashMap<Integer, PhotographDto> sharedPhotoMap = new HashMap<>();
		
		for (int i = 0; i < sharedPhotoList.size(); i++) {
			PhotographDto photographDto = this.photographServiceImpl.getById(
					sharedPhotoList.get(i).getPhotograph_id());
			sharedPhotoMap.put(sharedPhotoList.get(i).getShared_photo_id(), photographDto);
		}
		shareDto.setSharedPhotoMap(sharedPhotoMap);
		return shareDto;
	}
	
	public List<ShareDto> getAll() {
		List<Share> shareList = this.shareDaoImpl.getAll();
		
		if (shareList == null) {
			return null;
		}
		
		List<ShareDto> shareDtoList = new ArrayList<>();
		
		for (int i = 0; i < shareList.size(); i++) {
			Share share = shareList.get(i);
			List<SharedPhoto> sharedPhotoList = this.sharedPhotoDaoImpl.getListByShareId(share.getShare_id());
			ShareDto shareDto = new ShareDto(
					share.getShare_id(),
					share.getCustomer_id(),
					share.getBranch_id(),
					share.getCreated_at(),
					null);
			
			if (sharedPhotoList == null) {
				shareDtoList.add(shareDto);
				continue;
			}
			
			HashMap<Integer, PhotographDto> sharedPhotoMap = new HashMap<>();
			
			for (int j = 0; j < sharedPhotoList.size(); j++) {
				PhotographDto photographDto = this.photographServiceImpl.getById(
						sharedPhotoList.get(j).getPhotograph_id());
				sharedPhotoMap.put(sharedPhotoList.get(j).getShared_photo_id(), photographDto);
			}
			shareDto.setSharedPhotoMap(sharedPhotoMap);
			shareDtoList.add(shareDto);
		}

		return shareDtoList;
	}
	
	public void insert(ShareDto sd) {
		Share share = new Share(
				sd.getShareId(),
				sd.getCustomerId(),
				sd.getBranchId(),
				sd.getCreatedAt());
		this.shareDaoImpl.insert(share);
		
		for(Entry<Integer, PhotographDto> entry : sd.getSharedPhotoMap().entrySet()) {
			SharedPhoto sharedPhoto = new SharedPhoto(
					entry.getKey(),
					sd.getShareId(),
					entry.getValue().getPhotographId());
			this.sharedPhotoDaoImpl.insert(sharedPhoto);
		}
	}
	
	public void update(ShareDto sd) {
		Share share = new Share(
				sd.getShareId(),
				sd.getCustomerId(), 
				sd.getBranchId(),
				sd.getCreatedAt());
		this.shareDaoImpl.update(share);
		
		for(Entry<Integer, PhotographDto> entry : sd.getSharedPhotoMap().entrySet()) {
			SharedPhoto sharedPhoto = new SharedPhoto(
					entry.getKey(),
					sd.getShareId(),
					entry.getValue().getPhotographId());
			this.sharedPhotoDaoImpl.update(sharedPhoto);
		}
	}
	
	public void delete(Integer id) {
		this.shareDaoImpl.delete(id);
	}
	
	// Not Use
	public Integer getMaxPkValue() {
		return null;
	}
	
	public Integer getShareMaxPkValue() {
		return this.shareDaoImpl.getMaxPkValue();
	}
	
	public Integer getSharedPhotoMaxPkValue() {
		return this.sharedPhotoDaoImpl.getMaxPkValue();
	}
	
	public List<ShareDto> getListByCustomerId(Integer id) {
		List<Share> shareList = this.shareDaoImpl.getListByCustomerId(id);
		
		if (shareList == null) {
			return null;
		}
		
		List<ShareDto> shareDtoList = new ArrayList<>();
		
		for (int i = 0; i < shareList.size(); i++) {
			Share share = shareList.get(i);
			List<SharedPhoto> sharedPhotoList = this.sharedPhotoDaoImpl.getListByShareId(share.getShare_id());
			ShareDto shareDto = new ShareDto(
					share.getShare_id(),
					share.getCustomer_id(), 
					share.getBranch_id(),
					share.getCreated_at(),
					null);
			
			if (sharedPhotoList == null) {
				shareDtoList.add(shareDto);
				continue;
			}
			
			HashMap<Integer, PhotographDto> sharedPhotoMap = new HashMap<>();
			
			for (int j = 0; j < sharedPhotoList.size(); j++) {
				PhotographDto photographDto = this.photographServiceImpl.getById(
						sharedPhotoList.get(j).getPhotograph_id());
				sharedPhotoMap.put(sharedPhotoList.get(j).getShared_photo_id(), photographDto);
			}
			shareDto.setSharedPhotoMap(sharedPhotoMap);
			shareDtoList.add(shareDto);
		}

		return shareDtoList;
	}
	
	public List<ShareDto> getListByBranchIdAndIndex(Integer index, Integer id) {
		List<Share> shareList = this.shareDaoImpl.getListByBranchIdAndIndex(index, id);
		
		if (shareList == null) {
			return null;
		}
		
		List<ShareDto> shareDtoList = new ArrayList<>();
		
		for (int i = 0; i < shareList.size(); i++) {
			Share share = shareList.get(i);
			List<SharedPhoto> sharedPhotoList = this.sharedPhotoDaoImpl.getListByShareId(share.getShare_id());
			ShareDto shareDto = new ShareDto(
					share.getShare_id(),
					share.getCustomer_id(), 
					share.getBranch_id(),
					share.getCreated_at(),
					null);
			
			if (sharedPhotoList == null) {
				shareDtoList.add(shareDto);
				continue;
			}
			
			HashMap<Integer, PhotographDto> sharedPhotoMap = new HashMap<>();
			
			for (int j = 0; j < sharedPhotoList.size(); j++) {
				PhotographDto photographDto = this.photographServiceImpl.getById(
						sharedPhotoList.get(j).getPhotograph_id());
				sharedPhotoMap.put(sharedPhotoList.get(j).getShared_photo_id(), photographDto);
			}
			shareDto.setSharedPhotoMap(sharedPhotoMap);
			shareDtoList.add(shareDto);
		}
		
		return shareDtoList;
	}
}