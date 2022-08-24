pipeline {
 agent any
 stages {
   stage ("Compilar el proyecto devops") {
	   when {
                branch 'devops'
            }
            steps {
             sh """
	        sudo podman login registrynexusup.lab.data.com.py -u admin -p password
              """

             sh """
                sudo podman login registrynexus.lab.data.com.py -u admin -p password
               """

              sh """
	       sudo podman build -t registrynexusup.lab.data.com.py/dnerhs-ui:devops . 
	      """
              sh """
               sudo podman push registrynexusup.lab.data.com.py/dnerhs-ui:devops
              """
           }
   }
   stage ("Compilar el proyecto master") {
	   when {
                branch 'master'
            }
            steps {
             sh """
		sudo podman login registrynexusup.lab.data.com.py -u admin -p password
              """

             sh """
                sudo podman login registrynexus.lab.data.com.py -u admin -p password
               """

              sh """
	       sudo podman build -t registrynexusup.lab.data.com.py/dnerhs-ui:prd . 
	      """
              sh """
               sudo podman push registrynexusup.lab.data.com.py/dnerhs-ui:prd
              """
           }
   }
 }
}
