package rest.webservices.restfulwebservices.Students.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class HelloGlobalExceptionHandler {

	// 사용자 입력 오류 처리
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<CustomErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
		CustomErrorResponse error = new CustomErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage(),
				LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	// 그 외 예외 처리 예시
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<CustomErrorResponse> handleRuntimeException(RuntimeException ex) {
		CustomErrorResponse error = new CustomErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage(),
				LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
