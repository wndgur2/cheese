package com.hknu.service;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.hknu.dao.ShareDaoImpl;
import com.hknu.dao.SharedPhotoDaoImpl;
import com.hknu.dto.PhotographDto;
import com.hknu.dto.ShareDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.entity.Share;
import com.hknu.entity.SharedPhoto;
import com.hknu.exception.CustomException;
import com.hknu.exception.DoNotMatchImageTypeException;

@org.springframework.stereotype.Service
public class ShareServiceImpl implements Service<ShareDto>{
	@Autowired
	private ShareDaoImpl shareDaoImpl;
	@Autowired
	private SharedPhotoDaoImpl sharedPhotoDaoImpl;
	@Autowired
	private PhotographServiceImpl photographServiceImpl;
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
		
	public ResponseEntity<ResponseDto<NullType>> insertShare(
			Integer customerId, 
			List<MultipartFile> photo,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		HashMap<Integer, PhotographDto> sharedPhotoMap = new HashMap<>();
		Integer sharedPhotoMaxPkValue = getSharedPhotoMaxPkValue();
		Integer firstBranchIdFromPhotograph = null;
		
		try {		
			for (int i = 0; i < photo.size(); i++) {
				MultipartFile image = photo.get(i);
				
				if (!image.isEmpty()) {
					byte[] byteImage = null;
					
					if (isImageFile(image.getContentType())) {
						byteImage = image.getBytes();
						PhotographDto photographDto = this.photographServiceImpl.getByPhotoImage(byteImage);
						
						if (!photographDto.getCustomerId().equals(customerId)) {
							throw new CustomException("사진과 회원 정보가 일치하지 않습니다.");
						}
						
						if (i == 0) {
							firstBranchIdFromPhotograph = photographDto.getBranchId();
						} else {
							if (photographDto.getBranchId() != firstBranchIdFromPhotograph) {
								throw new CustomException("사진 간의 지점 정보가 일치하지 않습니다.");
							}
						}
						sharedPhotoMap.put(sharedPhotoMaxPkValue + i, photographDto);
					} else {
						throw new DoNotMatchImageTypeException();
					}
				}
			}
			Timestamp date = new Timestamp(System.currentTimeMillis() + (9 * 60 * 60 * 1000));
			ShareDto shareDto = new ShareDto(
					getShareMaxPkValue(), 
					customerId, 
					customerServiceImpl.getNickNameById(customerId),
					firstBranchIdFromPhotograph,
					date, 
					sharedPhotoMap);
			insert(shareDto);
		} catch (IOException e) {
			return new ResponseEntity<>(
					ResponseDto.of("사진 공유 글을 게시하는 중에 오류가 발생했습니다."),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 사진 공유 글을 게시했습니다."),
				HttpStatus.OK);
	}
		

	public ResponseEntity<ResponseDto<NullType>> deleteShare(
			Integer customerId, 
			Integer shareId, 
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		ShareDto shareDto = getById(shareId);
		if (shareDto.getCustomerId().equals(customerId)) {
			delete(shareId);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 사진 공유 글을 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("사진 공유 글과 회원 정보가 일치하지 않습니다.");
	}
		
	public ResponseEntity<ResponseDto<List<ShareDto>>> getShareByCustomerId(
			Integer customerId, 
			String accessToken, 
			String refreshToken) {
		ResponseEntity<ResponseDto<List<ShareDto>>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		List<ShareDto> shareDtoList = getListByCustomerId(customerId);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 내가 공유한 모든 사진 공유 글을 가져왔습니다.", shareDtoList),
				HttpStatus.OK);
	}
		
	public ResponseEntity<ResponseDto<List<ShareDto>>> getListShares(
			Integer index, 
			Integer branchId) {
		if (index < 1) {
			throw new CustomException("인덱스 값은 1 이상이어야 합니다.");
		}
		
		return new ResponseEntity<>(
				ResponseDto.of(String.format("성공적으로 최근 %d 번째부터 10개의 사진 공유 글을 가져왔습니다.", (index - 1) * 10 + 1), getListByBranchIdAndIndex(index, branchId)),
				HttpStatus.OK);
	}
	
	public ShareDto getById(Integer id) {
		Share share = this.shareDaoImpl.getById(id);
		List<SharedPhoto> sharedPhotoList = this.sharedPhotoDaoImpl.getListByShareId(id);
		ShareDto shareDto = new ShareDto(
				share.getShare_id(),
				share.getCustomer_id(), 
				customerServiceImpl.getNickNameById(share.getCustomer_id()),
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
					customerServiceImpl.getNickNameById(share.getCustomer_id()),
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
					customerServiceImpl.getNickNameById(share.getCustomer_id()),
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
					customerServiceImpl.getNickNameById(share.getCustomer_id()),
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