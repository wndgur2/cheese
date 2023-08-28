package com.hknu.config;

import javax.servlet.MultipartConfigElement;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import com.hknu.util.Parser;

// 프로젝트 작업 시 사용할 bean을 정의하는 클래스
@Configuration
@ComponentScan({"com.hknu.exception", "com.hknu.service", "com.hknu.dao"})
@PropertySource("classpath:application.properties")
public class RootAppContext {
	@Autowired
	private Environment environment;
	
    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(environment.getProperty("spring.datasource.driver-class-name"));
        dataSource.setUrl(environment.getProperty("spring.datasource.url"));
        dataSource.setUsername(environment.getProperty("spring.datasource.username"));
        dataSource.setPassword(environment.getProperty("spring.datasource.password"));
        return dataSource;
    }
    
	// MultipartConfigElement 설정
	// 업로드된 파일 임시 저장 위치, 최대 파일 크기(바이트), 요청 최대 크기(바이트), 디스크에 쓰여질 임계값
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        String location = environment.getProperty("spring.servlet.multipart.location");
        long maxFileSize = Long.parseLong(environment.getProperty("spring.servlet.multipart.max-file-size"));
        long maxRequestSize = Long.parseLong(environment.getProperty("spring.servlet.multipart.max-request-size"));
        int fileSizeThreshold = Integer.parseInt(environment.getProperty("spring.servlet.multipart.file-size-threshold"));
        return new MultipartConfigElement(location, maxFileSize, maxRequestSize, fileSizeThreshold);
    }

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
    	RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
    	configuration.setHostName(environment.getProperty("spring.redis.host"));
    	configuration.setPort(Integer.parseInt(environment.getProperty("spring.redis.port")));
    	configuration.setPassword(environment.getProperty("spring.redis.password"));
    	return new LettuceConnectionFactory(configuration);
    }
    
    @Bean
    public RedisTemplate<String, String> redisTemplate() {
    	RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
    	redisTemplate.setConnectionFactory(redisConnectionFactory());
    	redisTemplate.setKeySerializer(new StringRedisSerializer());
    	redisTemplate.setValueSerializer(new StringRedisSerializer());
    	return redisTemplate;
    }
    
    @Bean
    public Parser parser() {
    	return new Parser();
    }
}
