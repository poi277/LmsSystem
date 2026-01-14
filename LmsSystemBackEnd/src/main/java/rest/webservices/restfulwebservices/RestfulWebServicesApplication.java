package rest.webservices.restfulwebservices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class RestfulWebServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestfulWebServicesApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") // 모든 경로에 대해
						// .allowedOrigins("http://localhost:3000") // 프론트 주소
						.allowedOrigins("http://localhost:3000",
								"http://lmssystem-env.eba-xbqcmdye.ap-southeast-2.elasticbeanstalk.com")
						.allowedMethods("*") // GET, POST, PUT 등 모두 허용
						.allowCredentials(true); // ✅ 꼭 필요
				// 인증 정보 포함 허용 .allowedHeaders("*").allowCredentials(true);

			}
		};
	}
}
