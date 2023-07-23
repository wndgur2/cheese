package com.hknu.service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import com.hknu.controller.exception.CustomException;

@org.springframework.stereotype.Service
public class ManagerService {
	@Autowired
	private Environment environment;
	
	public String getManagerByPassword(String password) {
		try {
			Scanner scanner = new Scanner(new File(environment.getProperty("cheese.manager-file.location")));
			
			if (scanner.hasNext()) {
				String managerPassword = scanner.next();
				scanner.close();
				return managerPassword;
			}
		}
		catch (IOException e) {
			System.out.println(String.format("manager file read error, %s", e));
		}
		return null;
	}
	
	public void updateManager(String password) {
		try {
			FileWriter fileWriter = new FileWriter(new File(environment.getProperty("cheese.manager-file.location")), false);
			fileWriter.write(password);
			fileWriter.close();
		}
		catch (IOException e) {
			throw new CustomException("비밀번호 수정 중에 오류가 발생했습니다.");
		}
	}
}
