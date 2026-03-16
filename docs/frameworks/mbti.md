# MBTI Framework Reference

## Overview

Myers-Briggs Type Indicator assigns one of 16 personality types based on four dichotomies. In Selfscape, MBTI is optional and self-reported (no assessment, just input if the user knows their type).

## Four Dichotomies

### E / I - Energy Direction
- **E (Extraversion):** Energy from the outer world, people, activity
- **I (Introversion):** Energy from the inner world, reflection, solitude
- **Display label:** "Energy from others" / "Energy from within"

### S / N - Information Gathering
- **S (Sensing):** Focus on concrete, present, factual information
- **N (Intuition):** Focus on patterns, possibilities, abstract meaning
- **Display label:** "What is" / "What could be"

### T / F - Decision Making
- **T (Thinking):** Decisions based on logic, consistency, objective criteria
- **F (Feeling):** Decisions based on values, harmony, impact on people
- **Display label:** "Logic first" / "Values first"

### J / P - Lifestyle Orientation
- **J (Judging):** Preference for structure, planning, closure
- **P (Perceiving):** Preference for flexibility, spontaneity, openness
- **Display label:** "Structure" / "Flow"

## 16 Types

ISTJ, ISFJ, INFJ, INTJ, ISTP, ISFP, INFP, INTP, ESTP, ESFP, ENFP, ENTP, ESTJ, ESFJ, ENFJ, ENTJ

## Input Design in Selfscape

Four rows, each with two tappable letter buttons:
```
[ E ] [ I ]     Energy from others / Energy from within
[ S ] [ N ]     What is / What could be
[ T ] [ F ]     Logic first / Values first
[ J ] [ P ]     Structure / Flow
```

Plus a skip option: "I'll discover this later"

## Integration with Profile

MBTI adds a subtle final layer to the world map and contributes to the LLM synthesis narrative. Since it overlaps significantly with Big Five (E/I maps roughly to Extraversion, J/P maps roughly to Conscientiousness), the synthesis narrative should note interesting convergences or tensions between the two.
