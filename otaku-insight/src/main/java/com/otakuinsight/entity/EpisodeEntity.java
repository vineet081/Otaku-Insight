package com.otakuinsight.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "episodes")
public class EpisodeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "episode_number")
    private Integer episodeNumber;

    @Column(name = "title")
    private String title;

    @Column(name = "rating")
    private Double rating;

    @ManyToOne
    @JoinColumn(name = "anime_mal_id")
    private AnimeEntity anime;

}
