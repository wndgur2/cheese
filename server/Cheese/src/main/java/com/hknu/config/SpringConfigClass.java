package com.hknu.config;

import javax.servlet.FilterRegistration;
import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.DispatcherServlet;

/*
 * WebApplicationInitializer를 이용해 사용자 설정 class를 만들어 직접 구현
 */
public class SpringConfigClass implements WebApplicationInitializer {
	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {
		// DispatcherServlet을 등록하기 위한 설정
	    AnnotationConfigWebApplicationContext servletAppContext = new AnnotationConfigWebApplicationContext();
		servletAppContext.register(ServletAppContext.class);
		
		// DispatcherServlet 등록
		DispatcherServlet dispatcherServlet = new DispatcherServlet(servletAppContext);
		ServletRegistration.Dynamic servlet = servletContext.addServlet("dispatcher", dispatcherServlet);
		servlet.setLoadOnStartup(1);	 // 가장 먼저 로딩함
		servlet.addMapping("/");		 // 모든 요청에 대해

		// Bean을 정의하는 클래스를 지정한다.
		AnnotationConfigWebApplicationContext rootAppContext = new AnnotationConfigWebApplicationContext();
		rootAppContext.register(RootAppContext.class);
		rootAppContext.refresh();
		
		MultipartConfigElement multipartConfigElement = rootAppContext.getBean(MultipartConfigElement.class);
		servlet.setMultipartConfig(multipartConfigElement);
		
		// Listener 설정
		ContextLoaderListener listener = new ContextLoaderListener(rootAppContext);
		servletContext.addListener(listener);
		
//		 Parameter Encoding 설정
//		 "dispatcher"라는 이름으로 등록된 dispatcherServlet 서블릿이 받아드리는 요청에 대해 이 Encoding filter를 통과시킴
		FilterRegistration.Dynamic filter = servletContext.addFilter("encodingFilter", CharacterEncodingFilter.class);
		filter.setInitParameter("encoding", "UTF-8");
		filter.addMappingForServletNames(null, false, "dispatcher");
		
		FilterRegistration.Dynamic corsFilter = servletContext.addFilter("corsFilter", CorsFilter.class);
		corsFilter.addMappingForServletNames(null, false, "*");
	}
}