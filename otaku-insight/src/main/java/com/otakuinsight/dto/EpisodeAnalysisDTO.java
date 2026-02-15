package com.otakuinsight.dto;

import lombok.Data;

@Data
public class EpisodeAnalysisDTO {

    private String animeName;
    private Integer totalEpisodes;
    private Double averageRating;

    private EpisodeDTO highestRatedEpisode;
    private EpisodeDTO lowestRatedEpisode;

    private Long episodesAbove9;
    private Long episodesAbove8;

}