package ropold.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RevealNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public RevealError handleRevealNotFoundException(RevealNotFoundException e) {
        e.printStackTrace();
        return new RevealError(e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public RevealError handleRuntimeException(RuntimeException e) {
        e.printStackTrace();
        return new RevealError(e.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public AccessDeniedError handleAccessDeniedException(AccessDeniedException e) {
        return new AccessDeniedError(e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();

        e.getBindingResult().getFieldErrors().forEach(fieldError -> {
            String fieldName = fieldError.getField();
            String errorMessage = fieldError.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }

    @ExceptionHandler(ImageDeletionException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ImageDeletionError handleImageDeletionException(ImageDeletionException e) {
        return new ImageDeletionError(e.getMessage());
    }
}
