package com.ucu.gestorgastos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.ucu.gestorgastos")
@EnableJpaRepositories("com.ucu.gestorgastos.repository")
public class GestorgastosApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestorgastosApplication.class, args);
	}

}

