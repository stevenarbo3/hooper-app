# Use a Miniconda base image
FROM continuumio/miniconda3

# Set the working directory
WORKDIR /app

# Copy environment file and create env
COPY environment.yml .
RUN conda install -y mamba -n base -c conda-forge && \
    mamba env create -f environment.yml

# Make sure the conda environment is activated:
SHELL ["conda", "run", "-n", "hooper", "/bin/bash", "-c"]

# Copy project files
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Run the app
CMD ["conda", "run", "-n", "hooper", "python", "server.py"]
