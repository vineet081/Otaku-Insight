package com.otakuinsight.dto;

import lombok.Data;

@Data
public class AnimeDTO {

    private Long malId;
    private String title;
    private Integer episodes;
    private Double score;
    private String synopsis;
    private String imageUrl;
    private Integer year;
    private String status;
}
