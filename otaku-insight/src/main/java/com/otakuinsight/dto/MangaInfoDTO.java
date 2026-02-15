package com.otakuinsight.dto;

import lombok.Data;

@Data
public class MangaInfoDTO {

    private String animeTitle;
    private String mangaTitle;
    private Integer totalMangaChapters;
    private Integer totalMangaVolumes;
    private String mangaStatus;
    private String continueFromChapter;
    private String note;

}