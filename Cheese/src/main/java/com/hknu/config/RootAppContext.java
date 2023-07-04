package com.hknu.config;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

// 프로젝트 작업 시 사용할 bean을 정의하는 클래스
@Configuration
@ComponentScan({"com.hknu.service", "com.hknu.dao"})
public class RootAppContext {
    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/cheesedb?serverTimezone=UTC");
        dataSource.setUsername("root");
        dataSource.setPassword("1234");
        return dataSource;
    }
}
