terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-1"
  access_key = ""
  secret_key = ""
}

resource "aws_ecr_repository" "frontend_ecr_repo" {
  name = "frontend-repo"
}

# main.tf
resource "aws_ecs_cluster" "dockertest-cluster" {
  name = "dockertest-cluster" # Name your cluster here
}

# main.tf
resource "aws_ecs_task_definition" "docker_task" {
  family                   = "docker-task" # Name your task
  container_definitions    = <<DEFINITION
  [
    {
      "name": "docker-task",
      "image": "${aws_ecr_repository.frontend_ecr_repo.repository_url}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000
        }
      ],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # use Fargate as the launch type
  network_mode             = "awsvpc"    # add the AWS VPN network mode as this is required for Fargate
  memory                   = 512         # Specify the memory the container requires
  cpu                      = 256         # Specify the CPU the container requires
  execution_role_arn       = "${aws_iam_role.ecsTaskExecutionRole-docker.arn}"
}

# main.tf
resource "aws_iam_role" "ecsTaskExecutionRole-docker" {
  name               = "ecsTaskExecutionRole-docker"
  assume_role_policy = "${data.aws_iam_policy_document.assume_role_policy.json}"
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_docker_policy" {
  role       = "${aws_iam_role.ecsTaskExecutionRole-docker.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Creating VPC,name, CIDR and Tags
resource "aws_vpc" "vpc-docker" {
  cidr_block           = "10.0.0.0/16"
  
  tags = {
    Name = "vpc-docker"
  }
}

# Creating Public Subnets in VPC
resource "aws_subnet" "pub-docker-1" {
  vpc_id                  = aws_vpc.vpc-docker.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = "true"
  availability_zone       = "ap-southeast-1a"
  tags = {
    Name = "pub-docker-1"
  }
}

resource "aws_subnet" "pub-docker-2" {
  vpc_id                  = aws_vpc.vpc-docker.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = "true"
  availability_zone       = "ap-southeast-1b"
  tags = {
    Name = "pub-docker-2"
  }
}

resource "aws_internet_gateway" "igw-docker" {
  vpc_id = aws_vpc.vpc-docker.id
  tags = {
    Name = "igw-docker"
  }
}

# Creating Route Tables for Internet gateway
resource "aws_route_table" "rt-docker" {
  vpc_id = aws_vpc.vpc-docker.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw-docker.id
  }
  tags = {
    Name = "rt-docker"
  }
}

# Creating Route Associations public subnets
resource "aws_route_table_association" "assoc-rt-docker-1" {
  subnet_id      = aws_subnet.pub-docker-1.id
  route_table_id = aws_route_table.rt-docker.id
}

resource "aws_route_table_association" "assoc-rt-docker-2" {
  subnet_id      = aws_subnet.pub-docker-2.id
  route_table_id = aws_route_table.rt-docker.id
}

# Creating Private Subnets in VPC
resource "aws_subnet" "priv-docker-1" {
  vpc_id                  = aws_vpc.vpc-docker.id
  cidr_block              = "10.0.3.0/24"
  map_public_ip_on_launch = "false"
  availability_zone       = "ap-southeast-1a"
  tags = {
    Name = "priv-docker-1"
  }
}

resource "aws_subnet" "priv-docker-2" {
  vpc_id                  = aws_vpc.vpc-docker.id
  cidr_block              = "10.0.4.0/24"
  map_public_ip_on_launch = "false"
  availability_zone       = "ap-southeast-1b"
  tags = {
    Name = "priv-docker-2"
  }
}

# main.tf
resource "aws_alb" "application_load_balancer" {
  name               = "load-balancer-docker" #load balancer name
  load_balancer_type = "application"
  subnets = [ # Referencing the default subnets
    "${aws_subnet.pub-docker-1.id}",
    "${aws_subnet.pub-docker-2.id}"
  ]
  # security group
  security_groups = ["${aws_security_group.load_balancer_docker_security_group.id}"]
}

# main.tf
# Create a security group for the load balancer:
resource "aws_security_group" "load_balancer_docker_security_group" {
  name = "load_balancer_docker_security_group"
  vpc_id = aws_vpc.vpc-docker.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow traffic in from all sources
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# main.tf
resource "aws_lb_target_group" "docker_target_group" {
  name        = "docker-target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = "${aws_vpc.vpc-docker.id}" # default VPC
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = "${aws_alb.application_load_balancer.arn}" #  load balancer
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = "${aws_lb_target_group.docker_target_group.arn}" # target group
  }
}

# main.tf
resource "aws_ecs_service" "docker_service" {
  name            = "docker-service"     # Name the service
  cluster         = "${aws_ecs_cluster.dockertest-cluster.id}"   # Reference the created Cluster
  task_definition = "${aws_ecs_task_definition.docker_task.arn}" # Reference the task that the service will spin up
  launch_type     = "FARGATE"
  desired_count   = 3 # Set up the number of containers to 3

  load_balancer {
    target_group_arn = "${aws_lb_target_group.docker_target_group.arn}" # Reference the target group
    container_name   = "${aws_ecs_task_definition.docker_task.family}"
    container_port   = 5000 # Specify the container port
  }

  network_configuration {
    subnets          = ["${aws_subnet.pub-docker-1.id}", "${aws_subnet.pub-docker-2.id}"]
    assign_public_ip = true     # Provide the containers with public IPs
    security_groups  = ["${aws_security_group.service_security_group.id}"] # Set up the security group
  }
}

# main.tf
resource "aws_security_group" "service_security_group" {
  vpc_id = aws_vpc.vpc-docker.id
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    # Only allowing traffic in from the load balancer security group
    security_groups = ["${aws_security_group.load_balancer_docker_security_group.id}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# main.tf
#Log the load balancer app URL
output "docker_url" {
  value = aws_alb.application_load_balancer.dns_name
}