package com.smartbank.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Entity
@Data
public class User{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private Long id;

    @NotEmpty
    private String name;

    @NotEmpty
    private String password;

    @Email
    @NotEmpty
    @Column(unique = true)
    private String email;

    @NotEmpty
    private String countryCode;

    @NotEmpty
    private String phoneNumber;

    @NotEmpty
    private String address;
//
//    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL)
//    private Acc
}
