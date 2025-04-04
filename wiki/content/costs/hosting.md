# Project Cost Comparison

## Infrastructure Costs

### Server

| Provider                   | Monthly Cost (USD) | Monthly Cost (GBP) | Student Credits                     | Pros                                                                                           | Cons                                                                                        |
| -------------------------- | ------------------ | ------------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Heroku                     | $9.00              | £6.94              | Available                           | Easy deployment                                                                                | Limited computing resources and not open source                                             |
| Digital Ocean with coolify | $28.00             | £21.58             | Available                           | Better performance, more control, fixed pricing                                                | more expensive after student credits run put                                                |
| AWS                        | $19.50             | £15.00             | Limited but free trial is available | Highly scalable, extensive service ecosystem                                                   | Complex pricing structure, can be expensive without optimization and steeper learning curve |
| Azure                      | $22.30             | £17.20             | Available                           | Good integration with Microsoft tools if we use those in the future, similar advantages to aws | Higher initial costs and steeper learning curve setup                                       |

### Frontend

| Provider                   | Monthly Cost (USD) | Monthly Cost (GBP) | Student Credits | Pros                                                            | Cons                                                                                                         |
| -------------------------- | ------------------ | ------------------ | --------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Heroku                     | $9.00              | £6.94              | Available       | Simple deployment                                               | cannot use for backend and frontend as only one free plan                                                    |
| Digital Ocean with coolify | $28.00             | £21.58             | Available       | Same infrastructure as backend(if used), consistent environment | Overkill for simple frontend hosting, ceredits will run ot faster with two droplets if using student credits |
| Vercel                     | $0.00              | £0.00              | N/A             | Optimized for frontend, excellent performance, free tier        | some advanced paid stuff, and only "hobby" stuff on free tier not sure legally                               |
| Netlify                    | $0.00              | £0.00              | N/A             | Great CI/CD, free tier                                          | advanced paid stuff and similar to vercel for free where "personal or prototypes" on free only               |

## Model Hosting Costs

### Nvidia T4

| Usage Scenario         | Cost per Hour (USD) | Cost per Hour (GBP) | Cost per Minute (USD) | Cost per Minute (GBP) | Monthly Cost (USD) | Monthly Cost (GBP) |
| ---------------------- | ------------------- | ------------------- | --------------------- | --------------------- | ------------------ | ------------------ |
| Base Rate              | $0.50               | £0.39               | $0.0084               | £0.0065               | -                  | -                  |
| 20 users × 30 min/week | -                   | -                   | -                     | -                     | $21.84             | £16.87             |

**Pros:**

- Lower cost option suitable for budget constraints
- Adequate performance for smaller fine-tuned models
- Sufficient for basic inference tasks
- Pay-per-use model keeps costs predictable

**Cons:**

- Less powerful than higher-tier GPUs
- Slower inference times, especially for larger models
- May struggle with multiple concurrent users
- Performance bottlenecks possible during peak usage

### Nvidia L4

| Usage Scenario         | Cost per Hour (USD) | Cost per Hour (GBP) | Cost per Minute (USD) | Cost per Minute (GBP) | Monthly Cost (USD) | Monthly Cost (GBP) |
| ---------------------- | ------------------- | ------------------- | --------------------- | --------------------- | ------------------ | ------------------ |
| Base Rate              | $0.80               | £0.62               | $0.014                | £0.0108               | -                  | -                  |
| 20 users × 30 min/week | -                   | -                   | -                     | -                     | $36.40             | £28.06             |

**Pros:**

- Better performance and faster inference times
- More capable of handling complex models
- Better user experience with quicker responses
- will handle concurrent users more effectively

**Cons:**

- more expensive than T4 option
- May be overkill for smaller or simpler models
- Higher ongoing costs impact budget
- Cost might not justify performance gain for this specific use case

## Testing Costs

| Testing Type              | Estimated Cost (USD) | Estimated Cost (GBP) |
| ------------------------- | -------------------- | -------------------- |
| Model Performance Testing | $3.90-6.50           | £3.00-5.00           |

## Total Cost (Cheapest Options)

| Component     | Provider/Option                           | Monthly Cost (USD) | Monthly Cost (GBP) |
| ------------- | ----------------------------------------- | ------------------ | ------------------ |
| Server        | Heroku/Digital Ocean with student credits | $0.00              | £0.00              |
| Frontend      | Digital Ocean with coolify or vercel      | $0.00              | £0.00              |
| Model Hosting | Nvidia T4 (20 users × 30 min/week)        | $21.84             | £16.87             |
| **Total**     |                                           | **$21.84**         | **£16.87**         |

### Stuff to note

- Budget can be controlled by setting usage limits per account
- Smaller fine-tuned models should run adequately on the T4 plan
- need to implement usage monitoring to prevent unexpected costs
