package com.hknu.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.socket.WebSocketSession;

import com.hknu.dao.BranchDaoImpl;
import com.hknu.domain.Room;
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
	private RoomService roomService;
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.shooting-cost}")
	private Integer defaultShootingCost;
	@Value("${cheese.printing-cost}")
	private Integer defaultPrintingCost;
	@Value("${cheese.manager-email}")
    private String manager_email;
//	private static ConcurrentHashMap<Integer, ConcurrentLinkedQueue<String>> cameraQueue = new ConcurrentHashMap<>();
//	private static ConcurrentHashMap<Integer, ConcurrentLinkedQueue<String>> printerQueue = new ConcurrentHashMap<>();
	
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
	
	public ResponseEntity<ResponseDto<Map<String, Integer>>> insertBranch(
			String name, 
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
	
	public ResponseEntity<ResponseDto<NullType>> updateBranch(
			Integer branchId, 
			String name, 
			float latitude, 
			float longitude,
			Integer shooting_cost,
			Integer printing_cost,
			Integer paper_amount,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);

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
	
	public ResponseEntity<ResponseDto<NullType>> deleteBranch(
			Integer branchId,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);

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
	
	public ResponseEntity<ResponseDto<Map<String, Integer>>> checkCameraClients(
			Integer branchId, 
			String device) {
		getById(branchId);
	        
		Room room = this.roomService.findRoomByStringId(String.valueOf(branchId))
				.orElseThrow(() -> new CustomException("해당 지점은 현재 촬영 서비스가 준비되지 않았습니다."));
		
		Map<String, WebSocketSession> cameraClients = room.getCameraClient();
		Map<String, Integer> data = new HashMap<>();
		
		if (cameraClients.size() == 0) {
			data.put("length_queue", 0);
			return new ResponseEntity<>(
					ResponseDto.of("해당 지점은 현재 촬영 대기열이 존재하지 않습니다.", data), 
					HttpStatus.OK);
		}
		
		// Debug Code ======================================================================
		String total = "";
		for (Map.Entry<String, WebSocketSession> cameraClient : cameraClients.entrySet()) {
			 total += cameraClient.getKey();
			 total += ", ";
		}
        
        System.out.println(String.format("현재 총 촬영 대기열 디바이스 목록 : [%s]", total));
        // ====================================================================================
		
		if (device == null || device.isBlank()) {
	        data.put("length_queue", cameraClients.size());
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 해당 지점 촬영 대기열을 조회했습니다.", data), 
					HttpStatus.OK);
		}
		
		int index = 0;
		for (Map.Entry<String, WebSocketSession> cameraClient : cameraClients.entrySet()) {
			 if (cameraClient.getKey().equals(device)) {
				 data.put("length_queue", index);
				 return new ResponseEntity<>(
							ResponseDto.of("성공적으로 해당 지점 촬영 대기열의 사용자님 순번을 조회했습니다.", data), 
							HttpStatus.OK);
			 }
			 index++;
		}
        data.put("length_queue", index);
		return new ResponseEntity<>(
				ResponseDto.of("해당 지점 촬영 대기열에 사용자님은 등록돼있지 않습니다.", data), 
				HttpStatus.NOT_FOUND);
	}
	
	public ResponseEntity<ResponseDto<Map<String, Integer>>> checkPrinterClients(
			Integer branchId, 
			String device) {
		getById(branchId);
        
		Room room = this.roomService.findRoomByStringId(String.valueOf(branchId))
				.orElseThrow(() -> new CustomException("해당 지점은 현재 인화 서비스가 준비되지 않았습니다."));
		
		Map<String, WebSocketSession> printerClients = room.getPrinterClient();
		Map<String, Integer> data = new HashMap<>();
		
		if (printerClients.size() == 0) {
			data.put("length_queue", 0);
			return new ResponseEntity<>(
					ResponseDto.of("해당 지점은 현재 인화 대기열이 존재하지 않습니다.", data), 
					HttpStatus.OK);
		}
		
		// Debug Code ======================================================================
		String total = "";
		for (Map.Entry<String, WebSocketSession> printerClient : printerClients.entrySet()) {
			 total += printerClient.getKey();
			 total += ", ";
		}
        
        System.out.println(String.format("현재 총 인화 대기열 디바이스 목록 : [%s]", total));
        // ====================================================================================
		
		if (device == null || device.isBlank()) {
	        data.put("length_queue", printerClients.size());
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 해당 지점 인화 대기열을 조회했습니다.", data), 
					HttpStatus.OK);
		}
		
		int index = 0;
		for (Map.Entry<String, WebSocketSession> printerClient : printerClients.entrySet()) {
			 if (printerClient.getKey().equals(device)) {
				 data.put("length_queue", index);
				 return new ResponseEntity<>(
							ResponseDto.of("성공적으로 해당 지점 인화 대기열의 사용자님 순번을 조회했습니다.", data), 
							HttpStatus.OK);
			 }
			 index++;
		}
        data.put("length_queue", index);
		return new ResponseEntity<>(
				ResponseDto.of("해당 지점 인화 대기열에 사용자님은 등록돼있지 않습니다.", data), 
				HttpStatus.NOT_FOUND);
	}
	
//	public ResponseEntity<ResponseDto<Map<String, Integer>>> enCameraQueue(
//			Integer branchId, 
//			String device) {
//		if (device == null || device.isEmpty()) {
//			throw new CustomException("디바이스 정보가 옳지 않습니다.");
//		}
//		
//		Boolean cameraOrPrint = false;
//		Map<String, Integer> data = new HashMap<>();
//		Boolean isExist = enQueue(branchId, device, cameraOrPrint);
//		ConcurrentLinkedQueue<String> queue = getQueue(branchId, cameraOrPrint);
//		
//		if (!isExist) {
//	        Iterator<String> iterator = queue.iterator();
//	        Integer index = 0;
//
//	        while (iterator.hasNext()) {
//	            index++;
//	            String element = iterator.next();
//	            
//	            if (element.equals(device)) {
//			        data.put("length_queue", index);
//					return new ResponseEntity<>(
//							ResponseDto.of("이미 대기열에 존재하는 디바이스 입니다.", data), 
//							HttpStatus.BAD_REQUEST);
//	            }
//	        }
//		}
//		
//		data.put("length_queue", queue.size());
//		
//		return new ResponseEntity<>(
//				ResponseDto.of("성공적으로 촬영 대기열에 추가했습니다.", data), 
//				HttpStatus.OK);
//	}
	
//	public ResponseEntity<ResponseDto<NullType>> deCameraQueue(
//			Integer branchId, 
//			String device) {
//		if (device == null || device.isEmpty()) {
//			throw new CustomException("디바이스 정보가 옳지 않습니다.");
//		}
//		
//		Boolean cameraOrPrint = false;
//		removeElementFromQueue(branchId, device, cameraOrPrint);
//		return new ResponseEntity<>(
//				ResponseDto.of("성공적으로 촬영 대기를 취소했습니다."), 
//				HttpStatus.OK);
//	}
//	
//	public ResponseEntity<ResponseDto<Map<String, Integer>>> enPrinterQueue(
//			Integer branchId, 
//			String device) {
//		if (device == null || device.isEmpty()) {
//			throw new CustomException("디바이스 정보가 옳지 않습니다.");
//		}
//		
//		Boolean cameraOrPrint = true;
//		Map<String, Integer> data = new HashMap<>();
//		Boolean isExist = enQueue(branchId, device, cameraOrPrint);
//		ConcurrentLinkedQueue<String> queue = getQueue(branchId, cameraOrPrint);
//		
//		if (!isExist) {
//			Iterator<String> iterator = queue.iterator();
//			Integer index = 0;
//			
//			while (iterator.hasNext()) {
//				index++;
//				String element = iterator.next();
//				
//				if (element.equals(device)) {
//					data.put("length_queue", index);
//					return new ResponseEntity<>(
//							ResponseDto.of("이미 대기열에 존재하는 디바이스 입니다.", data), 
//							HttpStatus.BAD_REQUEST);
//				}
//			}
//		}
//
//		data.put("length_queue", queue.size());
//		
//		return new ResponseEntity<>(
//				ResponseDto.of("성공적으로 인화 대기열에 추가했습니다.", data), 
//				HttpStatus.OK);
//	}
//	
//	public ResponseEntity<ResponseDto<NullType>> dePrinterQueue(
//			Integer branchId, 
//			String device) {
//		if (device == null || device.isEmpty()) {
//			throw new CustomException("디바이스 정보가 옳지 않습니다.");
//		}
//		
//		Boolean cameraOrPrint = true;
//		removeElementFromQueue(branchId, device, cameraOrPrint);
//
//		return new ResponseEntity<>(
//				ResponseDto.of("성공적으로 인화 대기를 취소했습니다."), 
//				HttpStatus.OK);
//	}
//	
//	private ConcurrentLinkedQueue<String> getOrCreateQueue(
//			Integer branchId, 
//			Boolean cameraOrPrint) {
//		if (!cameraOrPrint) {
//			return cameraQueue.computeIfAbsent(branchId, k -> new ConcurrentLinkedQueue<>());
//		} else {
//			return printerQueue.computeIfAbsent(branchId, k -> new ConcurrentLinkedQueue<>());
//		}
//	}
//	
//	public ConcurrentLinkedQueue<String> getQueue(Integer branchId, Boolean cameraOrPrint) {
//		if (!cameraOrPrint) {
//			return cameraQueue.get(branchId);
//		} else {
//			return printerQueue.get(branchId);
//		}
//	}
//	
//	public Boolean enQueue(
//			Integer branchId, 
//			String device, 
//			Boolean cameraOrPrint) {
//		ConcurrentLinkedQueue<String> queue = getOrCreateQueue(branchId, cameraOrPrint);
//		if (!queue.contains(device)) {
//			queue.add(device);
//			return true;
//		} else {
//			return false;
//		}
//	}
//	
//	public String deQueue(
//			Integer branchId, 
//			Boolean cameraOrPrint) {
//		ConcurrentLinkedQueue<String> queue = null;
//		if (!cameraOrPrint) {
//			queue = cameraQueue.get(branchId);
//		} else {
//			queue = printerQueue.get(branchId);
//		}
//		
//		if (queue != null) {
//			return queue.poll();
//		}
//		return null;
//	}
//	
//	public Boolean removeElementFromQueue(
//			Integer branchId, 
//			String device, 
//			Boolean cameraOrPrint) {
//		ConcurrentLinkedQueue<String> queue = null;
//		if (!cameraOrPrint) {
//			queue = cameraQueue.get(branchId);
//		} else {
//			queue = printerQueue.get(branchId);
//		}
//		
//		if (queue != null) {
//			return queue.remove(device);
//		}
//		return false;
//	}
//	
//	public String checkNextElementFromQueue(
//			Integer branchId, 
//			Boolean cameraOrPrint) {
//		ConcurrentLinkedQueue<String> queue = null;
//		if (!cameraOrPrint) {
//			queue = cameraQueue.get(branchId);
//		} else {
//			queue = printerQueue.get(branchId);
//		}
//		
//		if (queue != null) {
//			return queue.peek();
//		}
//		return null;
//	}
	
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
