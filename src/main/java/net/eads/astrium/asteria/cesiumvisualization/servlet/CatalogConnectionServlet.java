package net.eads.astrium.asteria.cesiumvisualization.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.eads.astrium.asteria.services.orbitpropagation.IOrbitPropagationListener;
import net.eads.astrium.asteria.services.orbitpropagation.IOrbitPropagationService;
import net.eads.astrium.asteria.types.orbitpropagation.OrbitPropagationUpdate;

/**
 * 
 * @author SSA_HErnst
 *
 */
public class CatalogConnectionServlet extends HttpServlet {
	private final String USER_AGENT = "Mozilla/5.0";

	/**
	 * 
	 */
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		PrintWriter out = resp.getWriter();
		resp.setContentType("application/json");
		String numFrom = req.getParameter("numFrom");
		String numTo = req.getParameter("numTo");

		try {
			if (numFrom == null && numTo == null)
				out.write(sendGet());
			else
				out.write(sendGet(numFrom, numTo));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		out.close();
	}

	/**
	 * 
	 * @return
	 * @throws Exception
	 */
	private String sendGet() throws Exception {

		String url = "http://localhost:9091/OrbitPropagationSessionManagerService/getAllSatellites";

		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();

		// optional default is GET
		con.setRequestMethod("GET");
		con.setRequestProperty("Content-Type", "application/json");

		// add request header
		con.setRequestProperty("User-Agent", USER_AGENT);

		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'GET' request to URL : " + url);
		System.out.println("Response Code : " + responseCode);

		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();

		// print result
		System.out.println(response.toString());
		return response.toString();
	}

	/**
	 * 
	 * @return
	 * @throws Exception
	 */
	private String sendGet(String numFrom, String numTo) throws Exception {
		String url = "http://localhost:9091/OrbitPropagationSessionManagerService/getAllSatellites";

		url += "/" + numFrom;
		url += "/" + numTo;

		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();

		// optional default is GET
		con.setRequestMethod("GET");
		con.setRequestProperty("Content-Type", "application/json");

		// add request header
		con.setRequestProperty("User-Agent", USER_AGENT);

		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'GET' request to URL : " + url);
		System.out.println("Response Code : " + responseCode);

		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();

		// print result
		System.out.println(response.toString());
		return response.toString();
	}

}
