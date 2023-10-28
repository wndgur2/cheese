package com.hknu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;
import com.hknu.socket.SignalHandler;

@EnableWebMvc
@EnableWebSocket
@Configuration
@ComponentScan("com.hknu.controller")
public class ServletAppContext implements WebMvcConfigurer, WebSocketConfigurer {
	// Controller의 method가 반환하는 jsp의 이름 앞뒤에 경로와 확장자를 붙혀주도록 설정한다.
//	@Override
//	public void configureViewResolvers(ViewResolverRegistry registry) {
//		WebMvcConfigurer.super.configureViewResolvers(registry);
//		registry.jsp("/WEB-INF/views/", ".jsp");
//	}
	
	// 정적 파일의 경로를 mapping한다.
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		WebMvcConfigurer.super.addResourceHandlers(registry);
		registry.addResourceHandler("/**").addResourceLocations("/resources/");
	}
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(signalHandler(), "/signal").setAllowedOrigins("*");
	}

    @Bean
    public WebSocketHandler signalHandler() {
        return new SignalHandler();
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(1024 * 1024 * 20);
        container.setMaxBinaryMessageBufferSize(1024 * 1024 * 20);
        return container;
    }
}
