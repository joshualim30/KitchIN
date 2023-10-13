//
//  LoadView.swift
//  KitchIN
//
//  Created by Joshua Lim on 10/12/23.
//

import SwiftUI
import Alamofire

struct LoadView: View {
    
    var body: some View {
        
        // Set Loading Animation
        LoaderView(isLoading: true)
            .onAppear {
                
                self.loadIn()
                
            }
        
        // Slogan & Version
        Text("Your Kitchen. Your Way.")
            .font(.custom("AROneSans-Bold", size: 17))
        
        Text("v\(appVersion), b\(appBuild)")
            .font(.custom("AROneSans-Bold", size: 13))
            .foregroundStyle(Color("Primary"))
        
    }
    
    // Private Functions
    private func loadIn() {
        
        // Headers
        let headers: HTTPHeaders = []
        
        // Parameters
        let params: Parameters = [:]
        
        // Request
        AF.request("https://www.kitchin.com/api/v1/release/account/load", method: .post, parameters: params, headers: headers).validate(statusCode: statusCodes).responseData() { response in
            
            print("Response: \(String(data: response.data!, encoding: .utf8))")
            
        }
            
//        .responseDecodable(of: Account.self) { response in
//
//            // Redirect
//            // ...
//
//        }
        
    }
    
}

#Preview {
    LoadView()
}
