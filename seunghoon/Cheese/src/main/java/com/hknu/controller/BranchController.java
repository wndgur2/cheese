package com.hknu.controller;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.apache.tomcat.jakartaee.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hknu.controller.exception.CustomException;
import com.hknu.dto.BranchDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.BranchServiceImpl;
import com.hknu.service.TokenService;

@RestController
public class BranchController {
	@Autowired
	private BranchServiceImpl branchServiceImpl;
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.manager-email}")
    private String manager_email;
	
	// 지점 데이터 가져오기
	@GetMapping(value = "/branch/{branchId}")
	public ResponseEntity<ResponseDto<BranchDto>> getBranchById(@PathVariable Integer branchId) {
		BranchDto branchDto = this.branchServiceImpl.getById(branchId);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 지점 정보를 가져왔습니다.", branchDto),
				HttpStatus.OK);
	}
	
	// 모든 지점 데이터 가져오기
	@GetMapping(value = "/branch")
	public ResponseEntity<ResponseDto<List<BranchDto>>> getAllBranchs() {
		List<BranchDto> branchList = this.branchServiceImpl.getAll();
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 모든 지점 정보를 가져왔습니다.", branchList),
				HttpStatus.OK);
	}
	
	// 지점 추가하기
	@PostMapping(value = "/branch")
	public ResponseEntity<ResponseDto<Map<String, Integer>>> insertBranch(@RequestParam String name, 
							   											  @RequestParam float latitude, 
							   											  @RequestParam float longitude,
							   											  @RequestParam(required = false) Integer shooting_cost,
							   											  @RequestParam(required = false) Integer printing_cost,
							   											  @RequestParam Integer paper_amount,
							   											  @RequestHeader(required = false, value = "Authorization") String accessToken,
							   											  @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Map<String, Integer>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnMap(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			Integer maxPkValue = this.branchServiceImpl.getMaxPkValue();
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
			this.branchServiceImpl.insert(branchDto);
			
			Map<String, Integer> data = new HashMap<>();
			data.put("id", maxPkValue);
			
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 지점을 추가했습니다.", data),
					HttpStatus.OK);
		}
		throw new CustomException("지점 추가 중 오류가 발생했습니다.");
	}
	
	// 지점 수정하기
	@PutMapping(value = "/branch/{branchId}")
	public ResponseEntity<ResponseDto<Null>> updateBranch(@PathVariable Integer branchId, 
							   							  @RequestParam String name, 
							   							  @RequestParam float latitude, 
							   							  @RequestParam float longitude,
							   							  @RequestParam(required = false) Integer shooting_cost,
							   							  @RequestParam(required = false) Integer printing_cost,
							   							  @RequestParam(required = false) Integer paper_amount,
							   							  @RequestHeader(required = false, value = "Authorization") String accessToken,
							   							  @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			BranchDto branchDto = this.branchServiceImpl.getById(branchId);
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
			
			this.branchServiceImpl.update(branchDto);
			
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 지점을 수정했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("지점 수정 중 오류가 발생했습니다.");
	}
	
	// 지점 삭제하기
	@DeleteMapping(value = "/branch/{branchId}")
	public ResponseEntity<ResponseDto<Null>> deleteBranch(@PathVariable Integer branchId,
														  @RequestHeader(required = false, value = "Authorization") String accessToken,
														  @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			this.branchServiceImpl.delete(branchId);
			
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 지점을 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("지점 삭제 중 오류가 발생했습니다.");
	}
	
	// 카메라 대기열 조회하기
	@GetMapping(value = "/cameraQueue/{branchId}")
	public ResponseEntity<ResponseDto<Map<String, Integer>>> checkCameraQueue(@PathVariable Integer branchId, @RequestParam(required = false) String device) {
		this.branchServiceImpl.getById(branchId);
		Boolean cameraOrPrint = false;
		Map<String, Integer> data = new HashMap<>();
		ConcurrentLinkedQueue<String> queue = this.branchServiceImpl.getQueue(branchId, cameraOrPrint);

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
	
	// 카메라 대기열 추가하기
	@PostMapping(value = "/cameraQueue/{branchId}")
	public ResponseEntity<ResponseDto<Map<String, Integer>>> enCameraQueue(@PathVariable Integer branchId, @RequestParam String device) {
		if (device.isEmpty()) {
			throw new CustomException("디바이스 정보가 옳지 않습니다.");
		}
		
		Boolean cameraOrPrint = false;
		this.branchServiceImpl.enQueue(branchId, device, cameraOrPrint);
		ConcurrentLinkedQueue<String> queue = this.branchServiceImpl.getQueue(branchId, cameraOrPrint);
		
		Map<String, Integer> data = new HashMap<>();
		data.put("length_queue", queue.size());
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 촬영 대기열에 추가했습니다.", data), 
				HttpStatus.OK);
	}
	
	// 카메라 대기열 취소하기
	@DeleteMapping(value = "/cameraQueue/{branchId}")
	public ResponseEntity<ResponseDto<Null>> deCameraQueue(@PathVariable Integer branchId, @RequestParam String device) {
		if (device.isEmpty()) {
			throw new CustomException("디바이스 정보가 옳지 않습니다.");
		}
		
		Boolean cameraOrPrint = false;
		this.branchServiceImpl.removeFromQueue(branchId, device, cameraOrPrint);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 촬영 대기를 취소했습니다."), 
				HttpStatus.OK);
	}
	
	// 인화기 대기열 조회하기
	@GetMapping(value = "/printerQueue/{branchId}")
	public ResponseEntity<ResponseDto<Map<String, Integer>>> checkPrinterQueue(@PathVariable Integer branchId, @RequestParam(required = false) String device) {
		this.branchServiceImpl.getById(branchId);
		Boolean cameraOrPrint = true;
		Map<String, Integer> data = new HashMap<>();
		ConcurrentLinkedQueue<String> queue = this.branchServiceImpl.getQueue(branchId, cameraOrPrint);

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
	
	// 인화기 대기열 추가하기
	@PostMapping(value = "/printerQueue/{branchId}")
	public ResponseEntity<ResponseDto<Map<String, Integer>>> enPrinterQueue(@PathVariable Integer branchId, @RequestParam String device) {
		if (device.isEmpty()) {
			throw new CustomException("디바이스 정보가 옳지 않습니다.");
		}
		
		Boolean cameraOrPrint = true;
		this.branchServiceImpl.enQueue(branchId, device, cameraOrPrint);
		ConcurrentLinkedQueue<String> queue = this.branchServiceImpl.getQueue(branchId, cameraOrPrint);

		Map<String, Integer> data = new HashMap<>();
		data.put("length_queue", queue.size());
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 인화 대기열에 추가했습니다.", data), 
				HttpStatus.OK);
	}
	
	// 인화기 대기열 취소하기
	@DeleteMapping(value = "/printerQueue/{branchId}")
	public ResponseEntity<ResponseDto<Null>> dePrinterQueue(@PathVariable Integer branchId, @RequestParam String device) {
		if (device.isEmpty()) {
			throw new CustomException("디바이스 정보가 옳지 않습니다.");
		}
		
		Boolean cameraOrPrint = true;
		this.branchServiceImpl.removeFromQueue(branchId, device, cameraOrPrint);

		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 인화 대기를 취소했습니다."), 
				HttpStatus.OK);
	}
}
