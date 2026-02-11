package com.otakuinsight.service;

import com.otakuinsight.dto.AnimeDTO;
import com.otakuinsight.external.JikanClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnimeService {

    @Autowired
    private JikanClient jikanClient;

    public AnimeDTO searchAnime(String animeName) {


        if (animeName == null || animeName.trim().isEmpty()) {
            throw new IllegalArgumentException("Anime name cannot be empty");
        }


        AnimeDTO anime = jikanClient.searchAnime(animeName);


        if (anime == null) {
            throw new RuntimeException("Anime not found: " + animeName);
        }


        return anime;
    }

}