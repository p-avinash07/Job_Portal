package com.jobportal.service;

import java.util.Random;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class AIInterviewService {

	private final String[] keys = {"${apikey1}", "${apikey2}"};

	String API_KEY = keys[new Random().nextInt(keys.length)];


    // 🔹 Gemini Call
    private String callGemini(String prompt) {

        try {

            String url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

            // ✅ FIX (IMPORTANT)
            String safePrompt = prompt
                    .replace("\"", "\\\"")
                    .replace("\n", " ")
                    .replace("\r", " ");

            String requestBody = """
            {
              "contents": [
                {
                  "parts": [
                    {
                      "text": "%s"
                    }
                  ]
                }
              ]
            }
            """.formatted(safePrompt);

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, entity, String.class);

            // 🔥 Extract text only
            JSONObject json = new JSONObject(response.getBody());
            JSONArray candidates = json.getJSONArray("candidates");
            JSONObject content = candidates.getJSONObject(0).getJSONObject("content");
            JSONArray parts = content.getJSONArray("parts");

            return parts.getJSONObject(0).getString("text");

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    // 🎤 Start Interview
    public String startInterview(String role) {

        String prompt = """
        You are a professional interviewer.

        Start the interview:
        - Greet the candidate
        - Ask them to introduce themselves

        Keep it short and natural.
        """;

        return callGemini(prompt);
    }

    // 🔁 Next Question
    public String nextQuestion(String answer) {

        String prompt = """
        You are a strict interviewer.

        Based on this answer:
        "%s"

        Ask ONE follow-up interview question.
        Keep it short.
        Do NOT explain anything.
        """.formatted(answer);

        return callGemini(prompt);
    }

    // 📊 Final Evaluation
    public String finalEvaluation(String allAnswers) {

        String prompt = """
        Evaluate this candidate interview:

        Answers:
        %s

        Give:
        1. Final score out of 100
        2. Strengths (2 points)
        3. Weaknesses (2 points)
        4. Final verdict (Selected / Not Selected)

        Keep response clean and professional.
        """.formatted(allAnswers);

        return callGemini(prompt);
    }

    // ✅ 🆕 ATS RESUME SCORING
    public String atsScore(String resume, String jobDesc) {

        String prompt = """
        You are an ATS (Applicant Tracking System).

        Compare the resume with the job description.

        Resume:
        %s

        Job Description:
        %s

        Give output in this format:

        ATS Score: (out of 100)

        Matched Skills:
        - 

        Missing Skills:
        - 

        Suggestions:
        - 

        Keep it short and clear.
        """.formatted(resume, jobDesc);

        return callGemini(prompt);
    }
 // ✅ 🆕 JOB RECOMMENDATION
    public String recommendJobs(String skills) {

        String prompt = """
        You are a job recommendation system.

        Based on the following skills:
        %s

        Suggest 5 suitable job roles.

        Keep it simple like:
        - Job Role 1
        - Job Role 2
        """.formatted(skills);

        return callGemini(prompt);
    }
}