package com.hknu.config;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.DispatcherServlet;

import jakarta.servlet.FilterRegistration;
import jakarta.servlet.MultipartConfigElement;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRegistration;

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
	}
}

//import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;
//import jakarta.servlet.Filter;

/*
 * AbstractAnnotationConfigDispatcherServletInitializer에서 
 * 기본적으로 제공하는 class를 이용해 간편한 구현, 부가기능 추가 힘듬
 */
//public class SpringConfigClass extends AbstractAnnotationConfigDispatcherServletInitializer {
//	// DispatcherServlet에 매핑할 요청 주소를 세팅한다.
//	@Override
//	protected String[] getServletMappings() {
//		// TODO Auto-generated method stub
//		return new String[] { "/" };
//	}
//	
//	// Spring MVC 프로젝트 설정을 위한 클래스를 지정한다.
//	@Override
//	protected Class<?>[] getServletConfigClasses() {
//		// TODO Auto-generated method stub
//		return new Class[] { ServletAppContext.class };
//	}
//	
//	// 프로젝트에서 사용할 Bean들을 정의하기 위한 클래스를 지정한다.
//	@Override
//	protected Class<?>[] getRootConfigClasses() {
//		// TODO Auto-generated method stub
//		return new Class[] { RootAppContext.class };
//	}
//	
//	// Parameter Encoding Filter 설정
//	@Override
//	protected Filter[] getServletFilters() {
//		// TODO Auto-generated method stub
//		CharacterEncodingFilter encodingFilter = new CharacterEncodingFilter();
//		encodingFilter.setEncoding("UTF-8");
//		return new Filter[] { encodingFilter };
//	}
//}