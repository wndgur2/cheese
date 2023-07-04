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
	private SharedPhotoDaoImpl sharedPhotoDaoImpl;
	private PhotographServiceImpl photographServiceImpl;
	
	public ShareDto getById(int id) {
		Share share = this.shareDaoImpl.getById(id);
		List<SharedPhoto> sharedPhotoList = this.sharedPhotoDaoImpl.getListByShareId(id);
		HashMap<Integer, PhotographDto> sharedPhotoMap = new HashMap<>();
		
		for (int i = 0; i < sharedPhotoList.size(); i++) {
			PhotographDto photographDto = this.photographServiceImpl.getById(
					sharedPhotoList.get(i).getPhotograph_id());
			sharedPhotoMap.put(sharedPhotoList.get(i).getShared_photo_id(), photographDto);
		}
		
		ShareDto shareDto = new ShareDto(
				share.getShare_id(),
				share.getCustomer_id(), 
				share.getCreated_at(),
				sharedPhotoMap);
		// test
		System.out.println(shareDto.toString());
		return shareDto;
	}
	
	public List<ShareDto> getAll() {
		List<Share> shareList = this.shareDaoImpl.getAll();
		List<ShareDto> shareDtoList = new ArrayList<>();
		
		for (int i = 0; i < shareList.size(); i++) {
			Share share = shareList.get(i);
			List<SharedPhoto> sharedPhotoList = this.sharedPhotoDaoImpl.getListByShareId(share.getShare_id());
			HashMap<Integer, PhotographDto> sharedPhotoMap = new HashMap<>();
			
			for (int j = 0; j < sharedPhotoList.size(); j++) {
				PhotographDto photographDto = this.photographServiceImpl.getById(
						sharedPhotoList.get(j).getPhotograph_id());
				sharedPhotoMap.put(sharedPhotoList.get(j).getShared_photo_id(), photographDto);
			}
			
			ShareDto shareDto = new ShareDto(
					share.getShare_id(),
					share.getCustomer_id(), 
					share.getCreated_at(),
					sharedPhotoMap);
			shareDtoList.add(shareDto);
		}
		//test
		System.out.println(shareDtoList.toString());
		return shareDtoList;
	}
	
	public void insert(ShareDto sd) {
		Share share = new Share(
				sd.getShareId(),
				sd.getCustomerId(), 
				sd.getCreatedAt());
		this.shareDaoImpl.insert(share);
		
		for (int i = 0; i < sd.getSharedPhotoMap().size(); i++) {
			SharedPhoto sharedPhoto = new SharedPhoto(
					// 23.07.04
					// PK 값 클라이언트에서 받아올지? 여기서 생성해 사용할지? 의논 필요
					this.sharedPhotoDaoImpl.getMaxPkValue(), 
					sd.getShareId(),
					sd.getSharedPhotoMap().get(i).getPhotographId());
			this.sharedPhotoDaoImpl.insert(sharedPhoto);
		}
	}
	
	public void update(ShareDto sd) {
		Share share = new Share(
				sd.getShareId(),
				sd.getCustomerId(), 
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
	
	public void delete(int id) {
		this.shareDaoImpl.delete(id);
	}
}