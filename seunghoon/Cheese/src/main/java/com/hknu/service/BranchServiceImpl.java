package com.hknu.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.apache.tomcat.jakartaee.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.hknu.dao.BranchDaoImpl;
import com.hknu.dto.BranchDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.entity.Branch;
import com.hknu.exception.CustomException;

@org.springframework.stereotype.Service
public class BranchServiceImpl implements Service<BranchDto>{
	@Autowired
	private BranchDaoImpl branchDaoImpl;
	@Autowired
	private FrameServiceImpl frameServiceImpl;
	@Autowired
	private StickerServiceImpl stickerServiceImpl;
	@Autowired
	private FilterServiceImpl filterServiceImpl;
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.shooting-cost}")
	private Integer defaultShootingCost;
	@Value("${cheese.printing-cost}")
	private Integer defaultPrintingCost;
	@Value("${cheese.manager-email}")
    private String manager_email;
	private static ConcurrentHashMap<Integer, ConcurrentLinkedQueue<String>> cameraQueue = new ConcurrentHashMap<>();
	private static ConcurrentHashMap<Integer, ConcurrentLinkedQueue<String>> printerQueue = new ConcurrentHashMap<>();
	
	public ResponseEntity<ResponseDto<BranchDto>> getBranchById(Integer branchId) {
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 지점 정보를 가져왔습니다.", getById(branchId)),
				HttpStatus.OK);
	}
	
	public ResponseEntity<ResponseDto<List<BranchDto>>> getAllBranchs() {
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 모든 지점 정보를 가져왔습니다.", getAll()),
				HttpStatus.OK);
	}
	
	public ResponseEntity<ResponseDto<Map<String, Integer>>> insertBranch(String name, 
				   														  float latitude, 
				   														  float longitude,
				   														  Integer shooting_cost,
				   														  Integer printing_cost,
				   														  Integer paper_amount,
				   														  String accessToken,
				   														  String refreshToken) {
		ResponseEntity<ResponseDto<Map<String, Integer>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnMap(accessToken, refreshToken);

		if (responseEntity != null) {
			return responseEntity;
		}

		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			Integer maxPkValue = getMaxPkValue();
			BranchDto branchDto = new BranchDto(
					maxPkValue, 
					name,
					latitude, 
					longitude,  
					shooting_cost, 
					printing_cost, 
					paper_amount,
					null, 
					null, 
					null);
			insert(branchDto);

			Map<String, Integer> data = new HashMap<>();
			data.put("id", maxPkValue);

			return new ResponseEntity<>(
			ResponseDto.of("성공적으로 지점을 추가했습니다.", data),
			HttpStatus.OK);
		}
		throw new CustomException("지점 추가 중 오류가 발생했습니다.");
	}
	
	public ResponseEntity<ResponseDto<Null>> updateBranch(Integer branchId, 
				  										  String name, 
				  										  float latitude, 
				  										  float longitude,
				  										  Integer shooting_cost,
				  										  Integer printing_cost,
				  										  Integer paper_amount,
				  										  String accessToken,
				  										  String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);

		if (responseEntity != null) {
			return responseEntity;
		}

		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			BranchDto branchDto = getById(branchId);
			branchDto.setName(name);
			branchDto.setLatitude(latitude);
			branchDto.setLongitude(longitude);

			if (Objects.nonNull(shooting_cost)) {
				branchDto.setShootingCost(shooting_cost);
			}

			if (Objects.nonNull(printing_cost)) {
				branchDto.setPrintingCost(printing_cost);
			}

			if (Objects.nonNull(paper_amount)) {
				branchDto.setPaperAmount(paper_amount);
			}

			update(branchDto);

			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 지점을 수정했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("지점 수정 중 오류가 발생했습니다.");
	}
	
	public ResponseEntity<ResponseDto<Null>> deleteBranch(Integer branchId,
			  											  String accessToken,
			  											  String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);

		if (responseEntity != null) {
			return responseEntity;
		}

		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			delete(branchId);

			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 지점을 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("지점 삭제 중 오류가 발생했습니다.");
	}
	
	public ResponseEntity<ResponseDto<Map<String, Integer>>> checkCameraQueue(Integer branchId, 
																			  String device) {
		getById(branchId);
		Boolean cameraOrPrint = false;
		Map<String, Integer> data = new HashMap<>();
		ConcurrentLinkedQueue<String> queue = getQueue(branchId, cameraOrPrint);

		if (queue == null) {
			data.put("length_queue", 0);
			return new ResponseEntity<>(
					ResponseDto.of("해당 지점은 현재 촬영 대기열이 존재하지 않습니다.", data), 
					HttpStatus.OK);
		}
		else {
		    if (device != null) {
		        Iterator<String> iterator = queue.iterator();
		        Integer index = 0;

		        while (iterator.hasNext()) {
		            index++;
		            String element = iterator.next();
		            
		            if (element.equals(device)) {
				        data.put("length_queue", index);
						return new ResponseEntity<>(
								ResponseDto.of("성공적으로 해당 지점 촬영 대기열의 사용자님 순번을 조회했습니다.", data), 
								HttpStatus.OK);
		            }
		        }
		        data.put("length_queue", index);
				return new ResponseEntity<>(
						ResponseDto.of("해당 지점 촬영 대기열에 사용자님은 등록돼있지 않습니다.", data), 
						HttpStatus.OK);
		    }
	        data.put("length_queue", queue.size());
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 해당 지점 촬영 대기열을 조회했습니다.", data), 
					HttpStatus.OK);
		}
	}
	
	public ResponseEntity<ResponseDto<Map<String, Integer>>> enCameraQueue(Integer branchId, 
																		   String device) {
		if (device.isEmpty()) {
			throw new CustomException("디바이스 정보가 옳지 않습니다.");
		}
		
		Boolean cameraOrPrint = false;
		enQueue(branchId, device, cameraOrPrint);
		ConcurrentLinkedQueue<String> queue = getQueue(branchId, cameraOrPrint);
		
		Map<String, Integer> data = new HashMap<>();
		data.put("length_queue", queue.size());
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 촬영 대기열에 추가했습니다.", data), 
				HttpStatus.OK);
	}
	
	public ResponseEntity<ResponseDto<Null>> deCameraQueue(Integer branchId, 
														   String device) {
		if (device.isEmpty()) {
			throw new CustomException("디바이스 정보가 옳지 않습니다.");
		}
		
		Boolean cameraOrPrint = false;
		removeElementFromQueue(branchId, device, cameraOrPrint);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 촬영 대기를 취소했습니다."), 
				HttpStatus.OK);
	}
	
	public ResponseEntity<ResponseDto<Map<String, Integer>>> checkPrinterQueue(Integer branchId, 
																			   String device) {
		getById(branchId);
		Boolean cameraOrPrint = true;
		Map<String, Integer> data = new HashMap<>();
		ConcurrentLinkedQueue<String> queue = getQueue(branchId, cameraOrPrint);

		if (queue == null) {
			data.put("length_queue", 0);
			return new ResponseEntity<>(
					ResponseDto.of("해당 지점은 현재 인화 대기열이 존재하지 않습니다.", data), 
					HttpStatus.OK);
		}
		else {
		    if (device != null) {
		        Iterator<String> iterator = queue.iterator();
		        Integer index = 0;

		        while (iterator.hasNext()) {
		            index++;
		            String element = iterator.next();
		            
		            if (element.equals(device)) {
				        data.put("length_queue", index);
						return new ResponseEntity<>(
								ResponseDto.of("성공적으로 해당 지점 인화 대기열의 사용자님 순번을 조회했습니다.", data), 
								HttpStatus.OK);
		            }
		        }
		        data.put("length_queue", index);
				return new ResponseEntity<>(
						ResponseDto.of("해당 지점 인화 대기열에 사용자님은 등록돼있지 않습니다.", data), 
						HttpStatus.OK);
		    } 
	        data.put("length_queue", queue.size());
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 해당 지점 인화 대기열을 조회했습니다.", data), 
					HttpStatus.OK);
		}
	}
	
	public ResponseEntity<ResponseDto<Map<String, Integer>>> enPrinterQueue(Integer branchId, 
																			String device) {
		if (device.isEmpty()) {
			throw new CustomException("디바이스 정보가 옳지 않습니다.");
		}
		
		Boolean cameraOrPrint = true;
		enQueue(branchId, device, cameraOrPrint);
		ConcurrentLinkedQueue<String> queue = getQueue(branchId, cameraOrPrint);

		Map<String, Integer> data = new HashMap<>();
		data.put("length_queue", queue.size());
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 인화 대기열에 추가했습니다.", data), 
				HttpStatus.OK);
	}
	
	public ResponseEntity<ResponseDto<Null>> dePrinterQueue(Integer branchId, 
															String device) {
		if (device.isEmpty()) {
			throw new CustomException("디바이스 정보가 옳지 않습니다.");
		}
		
		Boolean cameraOrPrint = true;
		removeElementFromQueue(branchId, device, cameraOrPrint);

		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 인화 대기를 취소했습니다."), 
				HttpStatus.OK);
	}
	
	private ConcurrentLinkedQueue<String> getOrCreateQueue(Integer branchId, 
														   Boolean cameraOrPrint) {
		if (!cameraOrPrint) {
			return cameraQueue.computeIfAbsent(branchId, k -> new ConcurrentLinkedQueue<>());
		}
		else {
			return printerQueue.computeIfAbsent(branchId, k -> new ConcurrentLinkedQueue<>());
		}
	}
	
	public ConcurrentLinkedQueue<String> getQueue(Integer branchId, Boolean cameraOrPrint) {
		if (!cameraOrPrint) {
			return cameraQueue.get(branchId);
		}
		else {
			return printerQueue.get(branchId);
		}
	}
	
	public void enQueue(Integer branchId, 
						String device, 
						Boolean cameraOrPrint) {
		ConcurrentLinkedQueue<String> queue = getOrCreateQueue(branchId, cameraOrPrint);
		queue.add(device);
	}
	
	public String deQueue(Integer branchId, 
						  Boolean cameraOrPrint) {
		ConcurrentLinkedQueue<String> queue = null;
		if (!cameraOrPrint) {
			queue = cameraQueue.get(branchId);
		}
		else {
			queue = printerQueue.get(branchId);
		}
		
		if (queue != null) {
			return queue.poll();
		}
		return null;
	}
	
	public Boolean removeElementFromQueue(Integer branchId, 
										  String device, 
										  Boolean cameraOrPrint) {
		ConcurrentLinkedQueue<String> queue = null;
		if (!cameraOrPrint) {
			queue = cameraQueue.get(branchId);
		}
		else {
			queue = printerQueue.get(branchId);
		}
		
		if (queue != null) {
			return queue.remove(device);
		}
		return false;
	}
	
	public String checkNextElementFromQueue(Integer branchId, 
											Boolean cameraOrPrint) {
		ConcurrentLinkedQueue<String> queue = null;
		if (!cameraOrPrint) {
			queue = cameraQueue.get(branchId);
		}
		else {
			queue = printerQueue.get(branchId);
		}
		
		if (queue != null) {
			return queue.peek();
		}
		return null;
	}
	
	public BranchDto getById(Integer id) {
		Branch branch = this.branchDaoImpl.getById(id);
		BranchDto branchDto = new BranchDto(
				branch.getBranch_id(),
				branch.getName(),
				branch.getLatitude(),
				branch.getLongitude(),
				branch.getShooting_cost() != 0 ? branch.getShooting_cost() : defaultShootingCost,
				branch.getPrinting_cost() != 0 ? branch.getPrinting_cost() : defaultPrintingCost, 
				branch.getPaper_amount(), 
				this.frameServiceImpl.getListByBranchId(id), 
				this.stickerServiceImpl.getListByBranchId(id), 
				this.filterServiceImpl.getListByBranchId(id));

		return branchDto;
	}
	
	public List<BranchDto> getAll() {
		List<Branch> branchList = this.branchDaoImpl.getAll();
		List<BranchDto> branchDtoList = new ArrayList<>();
		
		for (int i = 0; i < branchList.size(); i++) {
			Branch branch = branchList.get(i);
			BranchDto branchDto = new BranchDto(
					branch.getBranch_id(),
					branch.getName(),
					branch.getLatitude(),
					branch.getLongitude(),
					branch.getShooting_cost() != 0 ? branch.getShooting_cost() : defaultShootingCost,
					branch.getPrinting_cost() != 0 ? branch.getPrinting_cost() : defaultPrintingCost, 
					branch.getPaper_amount(), 
					this.frameServiceImpl.getListByBranchId(branch.getBranch_id()), 
					this.stickerServiceImpl.getListByBranchId(branch.getBranch_id()), 
					this.filterServiceImpl.getListByBranchId(branch.getBranch_id()));
			branchDtoList.add(branchDto);
		}

		return branchDtoList;
	}
	
	public void insert(BranchDto bd) {
		Branch branch = new Branch(
				bd.getBranchId(),
				bd.getName(),
				bd.getLatitude(),
				bd.getLongitude(),
				Objects.nonNull(bd.getShootingCost()) ? bd.getShootingCost() : defaultShootingCost,
				Objects.nonNull(bd.getPrintingCost()) ? bd.getPrintingCost() : defaultPrintingCost, 
				bd.getPaperAmount());
		this.branchDaoImpl.insert(branch);
	}
	
	public void update(BranchDto bd) {
		Branch branch = new Branch(
				bd.getBranchId(),
				bd.getName(),
				bd.getLatitude(),
				bd.getLongitude(),
				bd.getShootingCost(),
				bd.getPrintingCost(), 
				bd.getPaperAmount());
		this.branchDaoImpl.update(branch);
	}
	
	public void delete(Integer id) {
		this.branchDaoImpl.delete(id);
	}
	
	public Integer getMaxPkValue() {
		return this.branchDaoImpl.getMaxPkValue();
	}
}
