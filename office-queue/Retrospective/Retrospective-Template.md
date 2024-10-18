TEMPLATE FOR RETROSPECTIVE (Team 16)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done = 7 vs 0
- Total points committed vs. done = 11 vs 0
- Nr of hours planned vs. spent (as a team) = 48.5 vs 72

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| #0     |   4    |    / |        10.5   |    17        |
| _#1 Get Ticket_   |        4        | 2      |    9        |      13        |
| #2 Next Customer     |  3       | 2       |   9         |     15         |
| #3 Call Customer     |  2     | 1      | 3           |    9         |
| #4 See Stats     |  3     |  3    |   11        |    8         |
| #5 Config Counters    | 4      |  3     |  6         |   10          |
| #6 Get Estimated Time     |     /  |    /  |     /      |        /     |
| #7 Notify Customer Served     |  /     | /     |     /      |      /       |




   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1 

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = 0.48$$          
    
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| = 0.22 $$
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated /
  - Total hours spent /
  - Nr of automated unit test cases  /
  - Coverage (if available) /
- E2E testing:
  - Total hours estimated /
  - Total hours spent /
- Code review  
  - Total hours estimated /
  - Total hours spent /
  


## ASSESSMENT

- What caused your errors in estimation (if any)? 
 > We underestimated the difficulty of some task and other tasks have been added later in developement.

- What lessons did you learn (both positive and negative) in this sprint?
 > We learned that is better to complete a user story before starting other user stories,
  also follow their order.
  We also learned that we need to organize and split task with more efficiency and write the unit tests.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  >  /(It's our first retrospective)
  
- Which ones you were not able to achieve? Why?
   > /(It's our first retrospective)
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Give more time to the planning phase of the project and write a document with the APIs.
  > Improve team coordination and comunication between members.

- One thing you are proud of as a Team!!
 > Even though 17/10's presentation didn't go well, we will learn from our mistakes and remain a cohesive team.
