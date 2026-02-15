package com.otakuinsight.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "anime")
public class AnimeEntity {

    @Id
    @Column(name = "mal_id")
    private Long malId;

    @Column(name = "title")
    private String title;

    @Column(name = "episodes")
    private Integer episodes;

    @Column(name = "score")
    private Double score;

    @Column(name = "status")
    private String status;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "year")
    private Integer year;

    @Column(columnDefinition = "TEXT")
    private String synopsis;

}
