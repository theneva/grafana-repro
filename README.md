# Grafana repro

A repro repo for an issue that makes every Slack notification channel include images if at least one of them includes images.

`request-logger/` contains a small Node app that accepts any HTTP request and logs its HTTP method, path, and request body. It pretends to be Slack, so we can inspect exactly what Grafana sends.

`$ docker-compose up` spins up the stack:

1. prometheus (to give my graph something to query)
2. grafana-image-renderer (I couldn't get Grafana to include images with the default PhantomJS rendering, and I have no idea why)
3. grafana (available for your convenience at http://localhost:3000; username & password are both `admin`) (configured to use 
4. request-logger, which acts as Slack in this repro

## Steps to run this

It seems irresponsible to share credentials for uploading to my storage bucket, so some setup is required on your part:

1. Create a Google Cloud Service Account for Grafana, which will be used to upload images
2. Download a keyfile for the service account, and save it as `./grafana/keyfile.json`
3. Create a Google Cloud Storage bucket with fine-grained access control
4. Grant the service account the `Storage Object Creator` role on the bucket
5. Edit the value of `GF_EXTERNAL_IMAGE_STORAGE_GCS_BUCKET` in docker-compose (the very last line) to the name of your bucket

You should now be ready to run everything with `docker-compose up` & visit Grafana at http://localhost:3000. Username & password are both `admin`.

You then need to create the following resources in Grafana (this is to follow the precise steps described in the issue at grafana/grafana):

1. Prometheus data source (http://localhost:3000/datasources/new) with HTTP URL set to `http://prometheus:9090`
2. Notification Channel (http://localhost:3000/alerting/notification/new) with name `slack (no images)`, type Slack, `Include image` toggled OFF, and `Url` set to `http://request-logger:8080/no-images`
3. Notification Channel (http://localhost:3000/alerting/notification/new) with name `slack (no images 2)`, type Slack, `Include image` toggled OFF, and `Url` set to `http://request-logger:8080/no-images-2`
4. Notification Chanel (http://localhost:3000/alerting/notification/new once again) with name `slack (iamges), type Slack, `Include image` toggled ON, and `Url` set to `http://request-logger:8080/with-images`
5. A dashboard (name doesn't matter, I called it "Repro")
6. A graph
    1. using the Prometheus data source from step 1
    2. with Metrics set to `vector(1)`
    3. with an alert rule that you can trigger at will (for example `Evaluate every`: `1s`, `For`: `0s`, condition when `avg ()` of `query (A, 5s, now)` is above `0`
    4. Under Notifications, `Send to` all three notification channels 
7. Save the dashboard

The alert should then trigger, sending messages with `image_url` in the attachment for all Slack channels, as opposed to just the one.
